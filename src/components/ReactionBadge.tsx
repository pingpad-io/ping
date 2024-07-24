import { PostReactionType } from "./post/Post";
import ReactionIcon from "./ReactionIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const ReactionBadge = ({
  reaction,
  amount,
  isPressed,
}: {
  reaction: PostReactionType | "Like";
  amount: number;
  isPressed?: boolean;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <ReactionIcon pressed={isPressed} reaction={reaction} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{`${amount} ${reaction.toLowerCase()}${amount === 1 ? "" : "s"}`}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);