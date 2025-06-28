import { PostReactionType } from "./post/Post";
import { ReactionBadge } from "./ReactionBadge";
import { ReactionCount } from "./ReactionCount";
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
    className={
      "border-0 px-0 place-content-center items-center flex flex-row gap-1.5 hover:bg-transparent [&>span:first-child]:hover:scale-110 [&>span:first-child]:active:scale-95"
    }
    disabled={disabled}
  >
    <span className="transition-transform">
      <ReactionBadge variant={variant} isPressed={reaction.isActive} reaction={reactionType} amount={reaction.count} />
    </span>
    {reactionType !== "Upvote" && reactionType !== "Downvote" && (
      <ReactionCount isPressed={reaction.isActive} amount={reaction.count} persistent={false} />
    )}
  </Button>
);
