import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const home = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  const fetchInitialData = async () => {
    if (isAuthenticated) {
      const response = await client.feed.fetch({ where: { for: profileId } });
      return response.unwrap();
    }

    return await client.publication.fetchAll({ where: { publicationTypes: [PublicationType.Post] } });
  };

  const initialData = await fetchInitialData();

  if (!initialData.items) {
    return <ErrorPage title={`Couldn't fetch posts`} />;
  }

  const posts = initialData.items.map(lensItemToPost).filter((post) => post);

  return (
    <FeedPageLayout>
      <InfiniteScroll endpoint={"posts/feed"} initialPosts={posts} initialCursor={initialData.pageInfo.next} />
    </FeedPageLayout>
  );
};

export default home;
