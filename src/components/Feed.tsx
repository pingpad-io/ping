import { type Notification, lensNotificationToNative } from "./notifications/Notification";
import { NotificationView } from "./notifications/NotificationView";
import { type Post, lensItemToPost } from "./post/Post";
import { PostSuspense } from "./post/PostSuspense";
import { PostView } from "./post/PostView";

export const FeedSuspense = () => {
  return [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
};

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
