import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { BookmarkIcon, HeartIcon, LibraryIcon, MessageSquareIcon, Repeat2Icon, ThumbsDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Post, PostReactionType } from "./Post";

export function hasReactions(post: Post) {
  return Object.values(post.reactions).some((value) => value !== 0 || value !== undefined);
}

export function ReactionsList({ post, inversed = false }: { post: Post; inversed?: boolean }) {
  if (!hasReactions(post)) return null;

  const reactions = Object.keys(post.reactions).map((reaction) => {
    const name = reaction as PostReactionType;
    const amount = post.reactions[name];
    const badge = <ReactionBadge key={`${post.id}-${reaction}`} reaction={name} amount={amount} />;

    if (amount === 0 && !inversed) return null;
    if (amount !== 0 && inversed) return null;

    return badge;
  });

  return reactions;
}

export const ReactionBadge = ({ reaction, amount }: { reaction: PostReactionType; amount: number }) => {
  const tooltipText = reaction.toLowerCase() + (amount === 1 ? "" : "s");
  const isUserReacted = false;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={isUserReacted ? "accent" : "outline"} size="icon" className={"h-6 w-max"} onClick={() => {}}>
            <span className={"flex flex-row gap-1 leading-3 px-2"}>
              {amount > 0 && amount}
              <ReactionIcon reaction={reaction} />
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {amount} {tooltipText}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ReactionIcon = ({ reaction }: { reaction: PostReactionType }) => {
  switch (reaction) {
    case "Upvote":
      return <HeartIcon size={14} />;
    case "Downvote":
      return <ThumbsDownIcon size={14} />;
    case "Comment":
      return <MessageSquareIcon size={14} />;
    case "Collect":
      return <LibraryIcon size={14} />;
    case "Bookmark":
      return <BookmarkIcon size={14} />;
    case "Repost":
      return <Repeat2Icon size={14} />;
    default:
      return <></>;
  }
};
