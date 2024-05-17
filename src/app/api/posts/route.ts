import type { PaginatedResult, FeedItemFragment, AnyPublicationFragment } from "@lens-protocol/client";
import { PublicationType } from "@lens-protocol/react-web";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const profileId = searchParams.get("profileId");
  const isAuthenticated = searchParams.get("isAuthenticated") === "true";

  try {
    const { client } = await getLensClient();

    let data: PaginatedResult<FeedItemFragment> | PaginatedResult<AnyPublicationFragment>;
    if (isAuthenticated) {
      data = (await client.feed.fetch({ where: { for: profileId }, cursor })).unwrap();
    } else {
      data = await client.publication.fetchAll({ where: { publicationTypes: [PublicationType.Post] }, cursor });
    }

    const posts = data.items.map(lensItemToPost).filter((post) => post);

    return new Response(JSON.stringify({ posts, nextCursor: data.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
  }
}
