import { PostSuspense } from "./post/PostSuspense";

export const FeedSuspense = () => {
  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
  const items = [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
  return <div className="flex flex-col gap-2">{items}</div>;
};
