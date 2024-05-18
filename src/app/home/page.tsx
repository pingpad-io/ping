import { PublicationType } from "@lens-protocol/client";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "api/posts/feed";

const home = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return (
    <FeedPageLayout>
      <InfiniteScroll endpoint={endpoint} initialPosts={posts} initialCursor={nextCursor} />
    </FeedPageLayout>
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();
  let data: any;
  if (isAuthenticated) {
    data = (await client.feed.fetch({ where: { for: profileId } })).unwrap();
  } else {
    data = await client.publication.fetchAll({ where: { publicationTypes: [PublicationType.Post] } });
  }

  const posts = data.items.map(lensItemToPost);
  return { posts, nextCursor: data.pageInfo.next };
};

export default home;
