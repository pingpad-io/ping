import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { BookmarkIcon, CirclePlusIcon, HeartIcon, MessageSquareIcon, Repeat2Icon, ThumbsDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";

export function hasReactions(post: Post) {
  return Object.values(post.reactions).some((value) => value !== 0 || value !== undefined);
}

export function ReactionsList({ post }: { post: Post }) {
  if (!hasReactions(post)) return null;

  return (
    <div className="flex flex-row items-center gap-12 w-full">
      <ReactionBadge key={`${post.id}-comments`} reaction={"Comment"} amount={post.reactions.Comment} />
      <ReactionBadge key={`${post.id}-reposts`} reaction={"Repost"} amount={post.reactions.Repost} />
      <ReactionBadge key={`${post.id}-upvotes`} reaction={"Upvote"} amount={post.reactions.Upvote} />
      <ReactionBadge key={`${post.id}-collects`} reaction={"Collect"} amount={post.reactions.Collect} />
      <div className="grow" />
      <div className="flex flex-row opacity-0 group-hover:opacity-100 duration-300 delay-150">
        <ReactionBadge key={`${post.id}-bookmarks`} reaction={"Bookmark"} amount={post.reactions.Bookmark} />
      </div>
    </div>
  );
}

export const ReactionBadge = ({ reaction, amount }: { reaction: PostReactionType; amount: number }) => {
  const formatAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  const tooltipText = reaction.toLowerCase() + (amount === 1 ? "" : "s");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={"h-max w-12 border-0 px-0 place-content-center items-center"}
            onClick={() => {}}
          >
            <span className={"flex flex-row gap-1 leading-4 py-1"}>
              {amount > 0 && formatAmount}
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
      return <HeartIcon size={15} />;
    case "Downvote":
      return <ThumbsDownIcon size={15} />;
    case "Repost":
      return <Repeat2Icon strokeWidth={1.5} size={19} />;
    case "Comment":
      return <MessageSquareIcon size={15} />;
    case "Collect":
      return <CirclePlusIcon size={16} />;
    case "Bookmark":
      return <BookmarkIcon size={16} />;
    default:
      return <></>;
  }
};
