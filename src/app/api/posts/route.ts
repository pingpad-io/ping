import {
  PageSize,
  PostType,
  type Result,
} from "@lens-protocol/client";
import { fetchTimeline, post, fetchPosts, deletePost, fetchPostsToExplore } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";
import { storageClient } from "~/utils/lens/storage";

// Constants for file upload
const MAX_DATA_SIZE = 1024 * 1024 * 2; // 2MB

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const type = searchParams.get("type") || "post";

  try {
    const { client, sessionClient, isAuthenticated, profileId } = await getServerAuth();

    const data = await fetchPosts(client, {
      filter: {
        postTypes: [PostType.Root],
        feeds: [{ globalFeed: true }],
      },
      cursor,
      pageSize: PageSize.Ten,
    });

    if (data.isErr()) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const posts = data.value.items.map((item) => { return lensItemToPost(item); });

    return NextResponse.json({ data: posts, nextCursor: data.value.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch feed: ", error);
    return NextResponse.json({ error: `Failed to fetch feed: ${error.message}` }, { status: 500 });
  }
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
