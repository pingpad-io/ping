import { ExplorePublicationType, ExplorePublicationsOrderByType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "api/posts/explore";

const explore = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    return <ErrorPage title={`Couldn't fetch posts`} />;
  }
  return (
    <FeedPageLayout>
      <InfiniteScroll endpoint={endpoint} initialPosts={posts} initialCursor={nextCursor} />
    </FeedPageLayout>
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (isAuthenticated) {
    const response = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy: ExplorePublicationsOrderByType.Latest,
    });

    const posts = response.items.map(lensItemToPost);
    return { posts, nextCursor: response.pageInfo.next };
  }
};

export default explore;
