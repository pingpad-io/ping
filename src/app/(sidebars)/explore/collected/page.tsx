import { fetchPosts } from "@lens-protocol/client/actions";
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
    try {
      // Note: In the new API, we don't have a direct equivalent for TopCollectedOpenAction
      // Using the API endpoint instead which has the appropriate filtering
      const response = await fetch("/api/posts/explore?type=collected");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      
      const result = await response.json();
      return { posts: result.data, nextCursor: result.nextCursor };
    } catch (error) {
      throw new Error("Failed to fetch posts: " + error.message);
    }
  }
  throw new Error("Unauthorized TT");
};

export default exploreCollected;
