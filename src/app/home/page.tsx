import ErrorPage from "~/components/ErrorPage";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { getBaseUrl } from "~/utils/getBaseUrl";

const home = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    return <ErrorPage title={`Couldn't fetch posts`} />;
  }
  return (
    <FeedPageLayout>
      <InfiniteScroll endpoint={"/api/posts/feed"} initialPosts={posts} initialCursor={nextCursor} />
    </FeedPageLayout>
  );
};

const getInitialFeed = async () => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts/feed`, {
    method: "GET",
  });
  if (!response.ok) throw new Error(`Couldn't fetch initial feed: ${response.statusText}`);

  const { posts, nextCursor } = await response.json();

  return { posts, nextCursor };
};

export default home;
