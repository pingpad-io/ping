import { PublicationType } from "@lens-protocol/client";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { FeedLayout } from "~/components/layout/FeedLayout";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/posts/feed";

const home = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to get posts");
  }

  return <InfiniteScroll endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();
  let data: any;

  if (isAuthenticated) {
    data = (
      await client.feed.fetch({ where: { for: profileId } }).catch(() => {
        throw new Error("(×_×)⌒☆ Failed to fetch feed");
      })
    ).unwrap();
  } else {
    data = await client.publication.fetchAll({ where: { publicationTypes: [PublicationType.Post] } }).catch(() => {
      throw new Error("(×_×)⌒☆ Failed to fetch feed");
    });
  }

  const posts = data.items.map(lensItemToPost);
  return { posts, nextCursor: data.pageInfo.next };
};

export default home;
