import { PostSuspense } from "./post/PostSuspense";

export const FeedSuspense = () => {
  const items = [...Array(12)].map((_v, idx) => <PostSuspense key={`suspense-${idx}`} />);
  return (
    <div className="flex flex-col gap-0.5">
      {items}
    </div>
  );
};
