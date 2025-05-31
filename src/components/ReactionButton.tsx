import { ReactionBadge } from "./ReactionBadge";
import { ReactionCount } from "./ReactionCount";
import { PostReactionType } from "./post/Post";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  reactionType: PostReactionType | "Like";
  reaction: { count: number; isActive: boolean };
  onClick: () => void;
  disabled?: boolean;
  variant?: "post" | "comment";
};

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  reactionType,
  reaction,
  onClick,
  disabled = false,
  variant = "post",
}) => (
  <Button
    size="sm"
    variant="ghost"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`border-0 px-0 place-content-center items-center flex flex-row gap-1 hover:bg-transparent text-sm sm:text-base ${variant === "post" ? "w-14 h-9" : "w-12 h-full"}`}
    disabled={disabled}
  >
    {reactionType !== "Upvote" && reactionType !== "Downvote" && (
      <ReactionCount isPressed={reaction.isActive} amount={reaction.count} persistent={false} />
    )}
    <ReactionBadge variant={variant} isPressed={reaction.isActive} reaction={reactionType} amount={reaction.count} />
  </Button>
);
