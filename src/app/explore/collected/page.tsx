import { ExplorePublicationType, ExplorePublicationsOrderByType } from "@lens-protocol/client";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/posts/explore?type=collected";

const exploreCollected = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return (
    <FeedPageLayout>
      <InfiniteScroll endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />
    </FeedPageLayout>
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (isAuthenticated) {
    const response = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy: ExplorePublicationsOrderByType.TopCollectedOpenAction,
    });

    const posts = response.items.map(lensItemToPost);
    return { posts, nextCursor: response.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default exploreCollected;
