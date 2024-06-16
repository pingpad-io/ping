import { S3 } from "@aws-sdk/client-s3";
import type { AnyPublicationFragment, FeedItemFragment, PaginatedResult } from "@lens-protocol/client";
import { LimitType, PublicationType } from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { env } from "~/env.mjs";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

const accessKeyId = env.STORAGE_ACCESS_KEY;
const secretAccessKey = env.STORAGE_SECRET_KEY;

const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: { accessKeyId, secretAccessKey },
  region: "4EVERLAND",
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const type = searchParams.get("type");
  const idFrom = searchParams.get("id");

  let publicationType: PublicationType;
  switch (type) {
    case "post":
      publicationType = PublicationType.Post;
      break;
    case "comment":
      publicationType = PublicationType.Comment;
      break;
    case "quote":
      publicationType = PublicationType.Quote;
      break;
    case "repost":
      publicationType = PublicationType.Mirror;
      break;
    default:
      publicationType = PublicationType.Post;
  }

  try {
    const { client, isAuthenticated, profileId } = await getLensClient();

    let data: PaginatedResult<FeedItemFragment> | PaginatedResult<AnyPublicationFragment>;
    if (isAuthenticated && !idFrom) {
      data = (await client.feed.fetch({ where: { for: profileId }, cursor })).unwrap();
    } else {
      data = await client.publication.fetchAll({
        where: { publicationTypes: [publicationType], from: [idFrom] },
        limit: LimitType.Ten,
        cursor,
      });
    }

    const posts = data.items.map(lensItemToPost);

    return NextResponse.json({ posts, nextCursor: data.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch posts: ", error);
    return NextResponse.json({ error: `Failed to fetch posts: ${error.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const { client, isAuthenticated, handle } = await getLensClient();

  if (!data) {
    return NextResponse.json({ error: "Bad Request: Invalid JSON body" }, { status: 400 });
  }

  // Arweave only sponsors <150kb data uploads for now
  if (data && data.length > 149 * 1024) {
    return NextResponse.json({ error: "Data too large" }, { status: 400 });
  }

  try {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const metadata = JSON.stringify(data);
    const date = new Date().toISOString();
    const key = `users/${handle}/${date}_metadata.json`;

    const uploadResult = await s3.putObject({
      ContentType: "application/json",
      Bucket: "pingpad-ar",
      Body: metadata,
      Key: key,
    });

    if (!uploadResult) {
      throw new Error("Failed to upload metadata to S3");
    }

    const result = await s3.headObject({
      Bucket: "pingpad-ar",
      Key: key,
    });

    const cid = result.Metadata["ipfs-hash"];
    const contentURI = `ipfs://${cid}`;
    const postResult = await client.publication.postOnMomoka({ contentURI });

    if (postResult.isFailure()) {
      throw new Error(postResult.error.message);
    }

    if (postResult.value.__typename === "LensProfileManagerRelayError") {
      throw new Error(postResult.value.reason);
    }

    if (postResult.value.__typename === "CreateMomokaPublicationResult") {
      const id = postResult.value.id;
      const momokaId = postResult.value.momokaId;
      const proof = postResult.value.proof;

      console.log(`${handle} created a post: ${id}, momokaId: ${momokaId}, ipfs: ${contentURI}, date: ${date}`);
      return NextResponse.json({ id, momokaId, proof }, { status: 200, statusText: "Success" });
    }

    throw new Error("Unknown error. This should never happen.");
  } catch (error) {
    console.error("Failed to create a post: ", error);
    return NextResponse.json({ error: `Failed to create a post: ${error.message}` }, { status: 500 });
  }
}
