import { S3 } from "@aws-sdk/client-s3";
import type {
  AnyPublicationFragment,
  CredentialsExpiredError,
  FeedItemFragment,
  LensClient,
  LensProfileManagerRelayErrorFragment,
  NotAuthenticatedError,
  PaginatedResult,
  RelaySuccessFragment,
  Result,
} from "@lens-protocol/client";
import { LimitType, PublicationType } from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { env } from "~/env.mjs";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

const accessKeyId = env.STORAGE_ACCESS_KEY;
const secretAccessKey = env.STORAGE_SECRET_KEY;
const MAX_DATA_SIZE = 149 * 1024; // 149KB
const BUCKET_NAME = "pingpad-ar";

const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: { accessKeyId, secretAccessKey },
  region: "4EVERLAND",
});

export async function GET(req: NextRequest) {
  try {
    const params = extractQueryParams(req);
    const { client, isAuthenticated, profileId } = await getLensClient();
    const publicationType = getPublicationType(params.type);

    const data = await fetchData(client, isAuthenticated, profileId, params, publicationType);
    const posts = data.items.map(lensItemToPost);

    return NextResponse.json({ posts, nextCursor: data.pageInfo.next }, { status: 200 });
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

function getPublicationType(type: string): PublicationType | PublicationType[] {
  const typeMap: Record<string, PublicationType | PublicationType[]> = {
    post: PublicationType.Post,
    comment: PublicationType.Comment,
    quote: PublicationType.Quote,
    repost: PublicationType.Mirror,
    any: [PublicationType.Post, PublicationType.Comment, PublicationType.Quote, PublicationType.Mirror],
  };

  return typeMap[type] || PublicationType.Post;
}

async function fetchData(
  client: any,
  isAuthenticated: boolean,
  profileId: string,
  params: ReturnType<typeof extractQueryParams>,
  publicationType: PublicationType | PublicationType[],
): Promise<PaginatedResult<FeedItemFragment> | PaginatedResult<AnyPublicationFragment>> {
  if (isAuthenticated && !params.idFrom && !params.community) {
    return (
      await client.feed.fetch({
        where: { for: profileId },
        cursor: params.cursor,
      })
    ).unwrap();
  }

  return await client.publication.fetchAll({
    where: {
      publicationTypes: Array.isArray(publicationType) ? publicationType : [publicationType],
      from: params.idFrom ? [params.idFrom] : undefined,
      metadata: params.community ? { tags: { oneOf: [params.community] } } : undefined,
    },
    limit: LimitType.Ten,
    cursor: params.cursor,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { client, isAuthenticated, profileId } = await getLensClient();

    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }

    const post = await client.publication.fetch({ forId: id });

    if (post.by.id !== profileId) {
      throw new Error("Not authorized");
    }

    let result: Result<void, CredentialsExpiredError | NotAuthenticatedError>;
    if (!post.isHidden) {
      result = await client.publication.hide({ for: id });
    }

    if (result.isFailure()) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({ result }, { status: 200 });
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
    const { client, isAuthenticated, handle } = await getLensClient();

    validateAuthentication(isAuthenticated);
    validateDataSize(data, handle);

    const contentURI = await uploadMetadata(data, handle);
    const postResult = await createPost(client, contentURI, replyingTo);

    return handlePostResult(postResult, handle, contentURI);
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

function validateAuthentication(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    throw new Error("Not authenticated");
  }
}

function validateDataSize(data: any, handle: string) {
  if (data && JSON.stringify(data).length > MAX_DATA_SIZE) {
    throw new Error(`Data too large for ${handle}`);
  }
}

async function uploadMetadata(data: any, handle: string) {
  const metadata = JSON.stringify(data);
  const date = new Date().toISOString();
  const key = `users/${handle}/${date}_metadata.json`;

  await s3.putObject({
    ContentType: "application/json",
    Bucket: BUCKET_NAME,
    Body: metadata,
    Key: key,
  });

  const result = await s3.headObject({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const cid = result.Metadata["ipfs-hash"];
  return `ipfs://${cid}`;
}

async function createPost(client: LensClient, contentURI: string, replyingTo?: string) {
  if (replyingTo) {
    return await client.publication.commentOnchain({ contentURI, commentOn: replyingTo });
  }
  return await client.publication.postOnchain({ contentURI });
}

function handlePostResult(
  postResult: Result<
    RelaySuccessFragment | LensProfileManagerRelayErrorFragment,
    CredentialsExpiredError | NotAuthenticatedError
  >,
  handle: string,
  contentURI: string,
) {
  if (postResult.isFailure()) {
    throw new Error(postResult.error.message);
  }

  if (postResult.value.__typename === "LensProfileManagerRelayError") {
    throw new Error(postResult.value.reason);
  }

  if (postResult.value.__typename === "RelaySuccess") {
    const { txId: id, txHash: hash } = postResult.value;
    const date = new Date().toISOString();
    console.log(`${handle} created a post: ${id}, hash: ${hash}, ipfs: ${contentURI}, date: ${date}`);
    return NextResponse.json({ id, hash }, { status: 200, statusText: "Success" });
  }

  throw new Error("Unknown error. This should never happen.");
}
