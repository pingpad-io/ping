import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

export const metadata: Metadata = {
  title: "Home",
  description: "Pingpad feed",
  openGraph: {
    title: "Home",
    description: "Pingpad feed",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const authenticatedEndpoint = "/api/posts/feed";
const unauthenticatedEndpoint = "/api/posts/";

const home = async () => {
  const { isAuthenticated } = await getServerAuth();
  const endpoint = isAuthenticated ? authenticatedEndpoint : unauthenticatedEndpoint;

  return <Feed ItemView={PostView} endpoint={endpoint} />;
};

export default home;
