import type { Post } from "./Post";
import { PostView } from "./PostView";
import PostWizard from "./PostWizard";

export const PostComments = ({ post, isWizardOpen }: { post: Post; isWizardOpen: boolean }) => {
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
      {isWizardOpen && (
        <div className="w-[90%] my-2">
          <PostWizard replyingTo={post} />
        </div>
      )}
    </div>
  );
};
