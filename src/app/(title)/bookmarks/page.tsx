import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
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

const endpoint = "/api/bookmarks";

const bookmarks = async () => {
  return <Feed ItemView={PostView} endpoint={endpoint} />;
};

export default bookmarks;
