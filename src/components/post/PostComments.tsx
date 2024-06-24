import type { Post } from "./Post";
import { PostView } from "./PostView";

export const PostComments = ({ post }: { post: Post }) => {
  const comments = post.comments.map((comment) => (
    <PostView key={comment.id} post={comment} settings={{ isComment: true, showBadges: true }} />
  ));

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className="w-[94%]">{comments}</div>
    </div>
  );
};
