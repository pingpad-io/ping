import { Feed } from "~/components/Feed";
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
  const { client, isAuthenticated } = await getServerAuth();
  if (isAuthenticated) {
    const data = await client.publication.bookmarks.fetch({}).catch((error) => {
      throw new Error(error.message);
    });

    if (data.isFailure()) throw new Error(data.error.message);

    const items = data.unwrap();
    const bookmarks = items.items?.map(lensItemToPost);

    return { bookmarks, nextCursor: items.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default bookmarks;
