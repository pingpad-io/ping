import { ExplorePublicationType, ExplorePublicationsOrderByType, LimitType } from "@lens-protocol/client";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "/api/posts/explore?type=collected";

const exploreCollected = async () => {
  const { posts, nextCursor } = await getInitialFeed();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return <Feed ItemView={PostView} endpoint={endpoint} initialData={posts} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getServerAuth();
  if (isAuthenticated) {
    const response = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy: ExplorePublicationsOrderByType.TopCollectedOpenAction,
      limit: LimitType.Ten,
    });

    const posts = response.items.map(lensItemToPost);
    return { posts, nextCursor: response.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default exploreCollected;
