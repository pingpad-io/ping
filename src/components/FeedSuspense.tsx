import { PostSuspense } from "./post/PostSuspense";

export const FeedSuspense = () => {
  const items = Array.from({ length: 12 }, () => <PostSuspense key={crypto.randomUUID()} />);
  return <div className="flex flex-col gap-0.5">{items}</div>;
};
