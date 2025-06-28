import { PostReactionType } from "./post/Post";
import ReactionIcon from "./ReactionIcon";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
}) => {
  const formattedAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(reaction.count);

  return (
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="transition-transform">
              <ReactionIcon variant={variant} pressed={reaction.isActive} reaction={reactionType} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${reaction.count} ${reactionType.toLowerCase()}${reaction.count === 1 ? "" : "s"}`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span
        className={`inline-flex items-center leading-none transition-colors duration-200 text-xs font-bold 
          ${reaction.isActive ? "text-primary" : "text-muted-foreground"}`}
      >
        <span className="w-fit min-w-[3ch] text-center">{reaction.count > 0 ? formattedAmount : ""}</span>
      </span>
    </Button>
  );
};
