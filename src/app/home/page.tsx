import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { getCookieAuth } from "~/utils/getCookieAuth";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "api/posts/feed";

const home = async () => {
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
