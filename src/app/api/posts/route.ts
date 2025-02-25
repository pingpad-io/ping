import type {
  Result,
} from "@lens-protocol/client";
import { fetchTimeline, post, fetchPosts, deletePost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";
import { storageClient } from "~/utils/lens/storage";

// Constants for file upload
const MAX_DATA_SIZE = 1024 * 1024 * 2; // 2MB

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = extractQueryParams(req);
    const { client, isAuthenticated, profileId } = await getServerAuth();
    const publicationType = getPublicationType(params.type);

    const data = await fetchData(client, isAuthenticated, profileId, params, publicationType);
    
    // Process the data based on its type
    let posts = [];
    let nextCursor = null;
    
    if (data && typeof data.unwrapOr === 'function') {
      const unwrapped = data.unwrapOr({ items: [], pageInfo: { next: null } });
      
      // Handle different response structures
      if (unwrapped.items) {
        posts = unwrapped.items.map(item => {
          // For TimelineItem, we need to extract the primary post
          if (item.__typename === "TimelineItem") {
            return lensItemToPost(item.primary);
          }
          return lensItemToPost(item);
        }).filter(Boolean);
        
        nextCursor = unwrapped.pageInfo?.next;
      }
    }

    return NextResponse.json({ data: posts, nextCursor }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch posts: ", error);
    return NextResponse.json({ error: `Failed to fetch posts: ${error.message}` }, { status: 500 });
  }
}

function extractQueryParams(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  return {
    idFrom: searchParams.get("id") || undefined,
    cursor: searchParams.get("cursor") || undefined,
    community: searchParams.get("community") || undefined,
    type: searchParams.get("type") || "any",
  };
}

function getPublicationType(type: string) {
  const typeMap = {
    post: "POST",
    comment: "COMMENT",
    quote: "QUOTE",
    repost: "MIRROR",
    any: ["POST", "COMMENT", "QUOTE", "MIRROR"],
  };

  return typeMap[type] || "POST";
}

async function fetchData(
  client,
  isAuthenticated,
  profileId,
  params,
  publicationType,
) {
  if (isAuthenticated && !params.idFrom && !params.community) {
    // Use the client directly for timeline if the fetchTimeline action has issues
    if (client.isSessionClient()) {
      try {
        // Try to use the client's direct API if available
        const result = await client.timeline({
          cursor: params.cursor,
        });
        return result;
      } catch (error) {
        console.error("Error fetching timeline with client:", error);
      }
    }
    
    // Fallback to fetching posts
    return await fetchPosts(client, {
      filter: {
        postTypes: ["POST", "COMMENT", "QUOTE", "MIRROR"],
      },
      cursor: params.cursor,
      pageSize: 10,
    });
  }

  return await fetchPosts(client, {
    filter: {
      authors: params.idFrom ? [params.idFrom] : undefined,
      metadata: params.community ? { tags: { oneOf: [params.community] } } : undefined,
      postTypes: Array.isArray(publicationType) ? publicationType : [publicationType],
    },
    cursor: params.cursor,
    pageSize: 10,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { client, isAuthenticated, profileId } = await getServerAuth();

    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }

    if (!client.isSessionClient()) {
      throw new Error("Not authenticated with a session client");
    }

    const result = await deletePost(client, { post: id });

    if (result && typeof result.unwrapOr === 'function') {
      const unwrapped = result.unwrapOr(null);
      if (!unwrapped) {
        throw new Error("Failed to delete post");
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to delete post: ${error.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const replyingTo = searchParams.get("replyingTo") || undefined;

    const data = await parseRequestBody(req);

    const { client, handle, profileId } = await getServerAuth();

    if (!profileId) {
      throw new Error("Not authenticated");
    }

    if (!client.isSessionClient()) {
      throw new Error("Not authenticated with a session client");
    }

    validateDataSize(data, handle);

    const contentUri = await uploadMetadata(data, handle);
    const postResult = await createPost(client, contentUri, replyingTo);

    if (postResult && typeof postResult.unwrapOr === 'function') {
      const unwrapped = postResult.unwrapOr(null);
      if (!unwrapped) {
        throw new Error("Failed to create post");
      }
      
      if (unwrapped.__typename === "LensProfileManagerRelayError") {
        throw new Error(unwrapped.reason);
      }

      if (unwrapped.__typename === "RelaySuccess") {
        const { txId: id, txHash: hash } = unwrapped;
        const date = new Date().toISOString();
        console.log(`${handle} created a post: ${id}, hash: ${hash}, ipfs: ${contentUri}, date: ${date}`);
        return NextResponse.json({ id, hash }, { status: 200, statusText: "Success" });
      }

      return NextResponse.json({ id: unwrapped.id }, { status: 200, statusText: "Success" });
    }

    throw new Error("Unknown error occurred");
  } catch (error) {
    console.error("Failed to create a post: ", error);
    return NextResponse.json({ error: `Failed to create a post: ${error.message}` }, { status: 500 });
  }
}

async function parseRequestBody(req: NextRequest) {
  const data = await req.json().catch(() => null);
  if (!data) {
    throw new Error("Bad Request: Invalid JSON body");
  }
  return data;
}

function validateDataSize(data: any, handle: string) {
  if (data && JSON.stringify(data).length > MAX_DATA_SIZE) {
    throw new Error(`Data too large for ${handle}`);
  }
}

async function uploadMetadata(data: any, handle: string) {
  try {
    // Use storageClient.uploadAsJson instead of S3
    const result = await storageClient.uploadAsJson(data);
    
    if (!result || !result.uri) {
      throw new Error("Failed to upload metadata");
    }
    
    console.log(`Uploaded metadata for ${handle} to ${result.uri}`);
    return result.uri;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw new Error(`Failed to upload metadata: ${error.message}`);
  }
}

async function createPost(client, contentUri, replyingTo) {
  if (replyingTo) {
    return await post(client, { 
      contentUri, 
      commentOn: replyingTo 
    });
  }
  return await post(client, { contentUri });
}
