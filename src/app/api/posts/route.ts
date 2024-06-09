import type { AnyPublicationFragment, FeedItemFragment, PaginatedResult } from "@lens-protocol/client";
import { LimitType, PublicationType } from "@lens-protocol/client";
import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";
import { S3 } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const accessKeyId = env.STORAGE_ACCESS_KEY;
const secretAccessKey = env.STORAGE_SECRET_KEY;

const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: { accessKeyId, secretAccessKey },
  region: "4EVERLAND",
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { client, isAuthenticated, profileId } = await getLensClient();

    let data: PaginatedResult<FeedItemFragment> | PaginatedResult<AnyPublicationFragment>;
    if (isAuthenticated) {
      data = (await client.feed.fetch({ where: { for: profileId }, cursor })).unwrap();
    } else {
      data = await client.publication.fetchAll({
        where: { publicationTypes: [PublicationType.Post] },
        cursor,
        limit: LimitType.Ten,
      });
    }

    const posts = data.items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: data.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const body = data?.body;

  if (!body) {
    return new Response(JSON.stringify({ error: "Bad Request" }), { status: 400 });
  }

  const metadata = body.metadata;

  try {
    const { client, isAuthenticated } = await getLensClient();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const matadataJson = JSON.stringify(metadata);

    await s3.putObject({
      Bucket: "pingpad-ar",
      Key: "metadata.json",
      Body: matadataJson,
      ContentType: "application/json",
    });

    const result = await s3.headObject({
      Bucket: "pingpad-ar",
      Key: "metadata.json",
    });

    const cid = result.Metadata["ipfs-hash"];
    const contentURI = `ipfs://${cid}`;
    console.log(`Upload success content URI=${contentURI}`);

    const post = await client.publication.postOnMomoka({ contentURI });

    console.log(post);

    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to create a post: ${error.message}` }), { status: 500 });
  }
}