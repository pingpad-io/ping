import type { Post } from "./Post";
import PostWizard from "./PostWizard";

export const PostReplyWizard = ({ post, isOpen }: { post: Post; isOpen: boolean }) => {
  if (!isOpen || !post) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className="w-[90%] gap-2 my-2">
        <PostWizard replyingTo={post} />
      </div>
    </div>
  );
};
