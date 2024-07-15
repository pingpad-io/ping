import { PostSuspense } from "./post/PostSuspense";

export const FeedSuspense = () => {
  return [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
};
