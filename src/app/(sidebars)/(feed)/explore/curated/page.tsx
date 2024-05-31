import { ExplorePublicationType, ExplorePublicationsOrderByType } from "@lens-protocol/client";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { FeedLayout } from "~/components/layout/FeedLayout";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/posts/explore?type=curated";

const exploreCurated = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return (
      <InfiniteScroll endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (isAuthenticated) {
    const response = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy: ExplorePublicationsOrderByType.LensCurated,
    });

    const posts = response.items.map(lensItemToPost);
    return { posts, nextCursor: response.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default exploreCurated;
