import { AiFillHeart } from "react-icons/ai";

export const SuspensePostView = () => {
  const avatar = (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-pulse rounded-full bg-base-300"></div>
    </div>
  );
  const content = (
    <div className="flex h-full flex-col items-start justify-center gap-2">
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-base-300"></div>
      <div className="my-2 h-4 w-full animate-pulse rounded-full bg-base-300"></div>
    </div>
  );

  const likes = <AiFillHeart size={35} className="h-12 w-12 animate-pulse text-base-300" />;

  return (
    <div className="rounded-box flex max-w-2xl flex-row gap-4 border border-base-300 p-4 ">
      {avatar}
      <div className="h-12 w-full grow">{content}</div>
      {likes}
    </div>
  );
};
