import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { HeartCrackIcon, HeartIcon } from "lucide-react";
import { Reaction, ReactionType } from "./Post";
import { Button } from "./ui/button";

export const ReactionBadge = ({ reaction, amount }: { reaction: ReactionType; amount: number }) => {
  const tooltipText = "votes";
  const isUserReacted = false;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isUserReacted ? "accent" : "outline"}
            size="icon"
            className={`h-6 ${amount > 0 ? "w-10" : "w-8"}`}
            onClick={() => {}}

          >
            <span className={"flex flex-row gap-1 leading-3"}>
              {amount > 0 ? amount : <></>}
              <ReactionIcon reaction={reaction} />
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ReactionIcon = ({ reaction }: { reaction: ReactionType }) => {
  switch (reaction) {
    case "UPVOTE":
      return <HeartIcon size={14} />;
    case "DOWNVOTE":
      return <HeartCrackIcon size={14} />;
    default:
      return <></>;
  }
};
