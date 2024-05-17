import type { Notification } from "./notifications/Notification";
import { NotificationView } from "./notifications/NotificationView";
import type { Post } from "./post/Post";
import { PostSuspense } from "./post/PostSuspense";
import { PostView } from "./post/PostView";

export const FeedSuspense = () => {
  return [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
};

export function Feed({ data }: { data?: Post[] }) {
  if (!data) return <FeedSuspense />;

  const feed = data.map((post, idx) => {
    return <PostView key={`${post.id}-${idx}`} post={post} />;
  });

  return feed;
}

export function NotificationsFeed({ data }: { data?: Notification[] }) {
  if (!data) return <FeedSuspense />;

  const feed = data.map((notification, idx) => {
    return <NotificationView key={`${notification.id}-${idx}`} notification={notification} />;
  });

  return feed;
}
