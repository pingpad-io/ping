import { Post } from "./post/Post";
import { PostView } from "./post/PostView";
import { FeedSuspense } from "./post/SuspenseView";

export function Feed({ data }: { data?: Post[] }) {
  if (!data) return <FeedSuspense />;

  const feed = data.map((post, idx) => {
    return <PostView key={`${post.id}-${idx}`} post={post} />;
  });

  return feed;
}
