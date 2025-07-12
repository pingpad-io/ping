import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { PostView } from "~/components/post/PostView";

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new content",
};

export default function ExplorePage() {
  return <Feed ItemView={PostView} endpoint="/api/posts/explore" />;
}