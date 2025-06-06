import { PageSize } from "@lens-protocol/client";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your bookmarked posts",
  openGraph: {
    title: "Bookmarks",
    description: "Your bookmarked posts",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "/api/bookmarks";

const bookmarks = async () => {
  const { bookmarks, nextCursor } = await getInitialFeed();

  if (!bookmarks) {
    throw new Error("Failed to get bookmarks (╥_╥)");
  }

  console.log(bookmarks);
  return <Feed ItemView={PostView} endpoint={endpoint} initialData={bookmarks} initialCursor={nextCursor} />;
};

const getInitialFeed = async () => {
  const { sessionClient, isAuthenticated } = await getServerAuth();
  if (isAuthenticated && sessionClient) {
    try {
      const result = await fetchPostBookmarks(sessionClient, { pageSize: PageSize.Fifty });

      if (result.isErr()) throw new Error(result.error.message);

      const items = result.value;
      const bookmarks = items.items?.map(lensItemToPost);

      return { bookmarks, nextCursor: items.pageInfo.next };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // throw new Error("Unauthorized TT");
  return {
    bookmarks: [],
    nextCursor: undefined,
  };
};

export default bookmarks;
