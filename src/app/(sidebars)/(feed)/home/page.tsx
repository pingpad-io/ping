import { PostType, TimelineEventItemType } from "@lens-protocol/client";
import { fetchPosts, fetchTimeline } from "@lens-protocol/client/actions";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { getServerAuth } from "~/utils/getServerAuth";

const authenticatedEndpoint = "/api/posts/feed";
const unauthenticatedEndpoint = "/api/posts/";

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
  const { client, isAuthenticated, profileId, address } = await getServerAuth();

  try {
    let data;

    if (client.isSessionClient()) {
      const result = await fetchTimeline(client, {
        account: address,
        filter: {
          eventType: [TimelineEventItemType.Post],
        },
        // cursor,
      });

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      data = result.value;
    } else {
      const result = await fetchPosts(client, {
        filter: {
          postTypes: [PostType.Root],
          feeds: [{ globalFeed: true }],
        },
      });

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      data = result.value;
    }

    const posts = data.items.map(lensItemToPost);
    return { posts, nextCursor: data.pageInfo.next };
  } catch (error) {
    throw new Error(`(×_×)⌒☆ Failed to fetch feed: ${error.message}`);
  }
};

export default home;
