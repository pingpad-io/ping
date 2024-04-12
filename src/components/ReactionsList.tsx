import { Post } from "./Post";
import { ReactionBadge } from "./Reactions";

export function ReactionsList({ post }: { post: Post }) {
  const reactions = post.reactions;

  if (reactions.length === 0) return null;

  const upvotes = reactions.filter((reaction) => reaction.type === "UPVOTE");
  const downvotes = reactions.filter((reaction) => reaction.type === "DOWNVOTE");

  return (
    <>
      <ReactionBadge key={`${post.id}-upvotes`} reaction={"UPVOTE"} amount={upvotes.length} />
      <ReactionBadge key={`${post.id}-downvotes`} reaction={"DOWNVOTE"} amount={downvotes.length} />
    </>
  );
}
