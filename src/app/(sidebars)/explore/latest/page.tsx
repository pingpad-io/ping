import { fetchPosts } from "@lens-protocol/client/actions";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "/api/posts/explore?type=latest";

const exploreLatest = async () => {
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
      const result = await fetchPosts(client, {
        filter: {
          postTypes: ["POST"],
        },
        pageSize: 10,
      });

      if (result.isErr()) {
        throw new Error("Failed to fetch posts");
      }

      const response = result.value;
      const posts = response.items.map(lensItemToPost);
      return { posts, nextCursor: response.pageInfo.next };
    } catch (error) {
      throw new Error("Failed to fetch posts: " + error.message);
    }
  }
  // throw new Error("Unauthorized TT");
  return {
    posts: [],
    nextCursor: undefined
  };
};

export default exploreLatest;
