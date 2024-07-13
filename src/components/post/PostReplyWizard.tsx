import type { Post } from "./Post";
import PostWizard from "./PostWizard";

export const PostReplyWizard = ({ post, level, isOpen }: { post: Post; level: number; isOpen: boolean }) => {
  if (!isOpen || !post) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div
        className={`animate-in slide-in-from-top-3 animate-out slide-out-to-top-3 duration-500 ease-in-out gap-2 my-2 ${
          level === 2 ? "w-[90%]" : "w-[94%]"
        }`}
      >
        <PostWizard replyingTo={post} />
      </div>
    </div>
  );
};
