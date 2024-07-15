import { LimitType } from "@lens-protocol/client";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "api/posts/best";

const best = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return <Feed ItemView={PostView} endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { client, isAuthenticated, profileId } = await getServerAuth();
  if (isAuthenticated) {
    const data = await client.feed.highlights({
      where: { for: profileId },
      limit: LimitType.Ten,
    });

    if (!data || !data.isSuccess()) {
      throw new Error("Failed to fetch feed");
    }

    const items = data.unwrap();
    const posts = items.items.map(lensItemToPost);

    return { posts, nextCursor: items.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default best;
