import type { Notification } from "./notifications/Notification";
import { NotificationView } from "./notifications/NotificationView";
import type { Post } from "./post/Post";
import { PostSuspense } from "./post/PostSuspense";
import { PostView } from "./post/PostView";

export function Feed({ data }: { data?: Post[] | Notification[] }) {
  if (!data) return <FeedSuspense />;

  const feed = data.map((item, idx) => {
    switch (item.__typename) {
      case "Post":
        return <PostView key={`${item.id}-${idx}`} post={item} />;
      case "Notification":
        return <NotificationView key={`${item.id}-${idx}`} notification={item} />;
    }
  });

  return feed;
}

export const FeedSuspense = () => {
  // biome-ignore lint/suspicious/noArrayIndexKey: intended behavior
  return [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
};
