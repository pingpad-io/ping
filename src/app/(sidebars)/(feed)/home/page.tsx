import { ExplorePublicationsOrderByType, LimitType } from "@lens-protocol/client";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const authenticatedEndpoint = "/api/posts/feed";
const unauthenticatedEndpoint = "/api/posts/explore?type=curated";

const home = async () => {
  const { posts, nextCursor } = await getInitialFeed();
  const { isAuthenticated } = await getServerAuth();
  const endpoint = isAuthenticated ? authenticatedEndpoint : unauthenticatedEndpoint;

  if (!posts) {
    throw new Error("Failed to get posts");
  }

  return <Feed ItemView={PostView} endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { client, isAuthenticated, profileId } = await getServerAuth();
  let data: any;

  if (isAuthenticated) {
    data = (
      await client.feed.fetch({ where: { for: profileId } }).catch(() => {
        throw new Error("(×_×)⌒☆ Failed to fetch feed");
      })
    ).unwrap();
  } else {
    data = await client.explore
      .publications({ orderBy: ExplorePublicationsOrderByType.LensCurated, limit: LimitType.Ten })
      .catch(() => {
        throw new Error("(×_×)⌒☆ Failed to fetch feed");
      });
  }

  const posts = data.items.map(lensItemToPost);
  return { posts, nextCursor: data.pageInfo.next };
};

export default home;
