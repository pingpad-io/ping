import type { Post } from "./Post";
import { PostView } from "./PostView";

export const PostComments = ({ post }: { post: Post }) => {
  const comments = post.comments.map((comment, index) => (
    <PostView
      key={comment.id}
      post={comment}
      settings={{
        isComment: true,
        showBadges: true,
        isLastComment: index === post.comments.length - 1,
      }}
    />
  ));

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <ul className="w-[90%]">{comments}</ul>
    </div>
  );
};
