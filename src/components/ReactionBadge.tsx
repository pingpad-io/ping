import ReactionIcon from "./ReactionIcon";
import { PostReactionType } from "./post/Post";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const ReactionBadge = ({
  reaction,
  amount,
  isPressed,
  variant = "post",
}: {
  reaction: PostReactionType | "Like";
  amount: number;
  isPressed?: boolean;
  variant?: "post" | "comment";
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <ReactionIcon variant={variant} pressed={isPressed} reaction={reaction} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{`${amount} ${reaction.toLowerCase()}${amount === 1 ? "" : "s"}`}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
