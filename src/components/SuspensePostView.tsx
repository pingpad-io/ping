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
      <div className="h-4 w-full animate-pulse rounded-full bg-base-300"></div>
    </div>
  );

  const likes = <AiFillHeart size={35} />;

  return (
    <div className="my-1 flex flex-row gap-4 rounded-xl border border-base-300 p-4">
      {avatar}
      <div className="h-12 w-full grow">{content}</div>
    </div>
  );
};
