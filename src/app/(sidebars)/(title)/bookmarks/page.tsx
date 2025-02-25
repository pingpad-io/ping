import { Feed } from "~/components/Feed";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "/api/bookmarks";

const bookmarks = async () => {
  const { bookmarks, nextCursor } = await getInitialFeed();

  if (!bookmarks) {
    throw new Error("Failed to get bookmarks (╥_╥)");
  }

  return <Feed ItemView={PostView} endpoint={endpoint} initialData={bookmarks} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { sessionClient, isAuthenticated } = await getServerAuth();
  if (isAuthenticated && sessionClient) {
    try {
      const result = await fetchPostBookmarks(sessionClient, { pageSize: 25 });

      if (result.isErr()) throw new Error(result.error.message);

      const items = result.value;
      const bookmarks = items.items?.map(lensItemToPost);

      return { bookmarks, nextCursor: items.pageInfo.next };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  throw new Error("Unauthorized TT");
};

export default bookmarks;
