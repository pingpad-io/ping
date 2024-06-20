"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import {
  Bookmark,
  BookmarkIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  Repeat2Icon,
  ThumbsDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";

export function hasReactions(post: Post) {
  return Object.values(post.reactions).some((value) => value !== 0 || value !== undefined);
}

export function ReactionsList({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.reactions.isUpvoted);
  const [isReposted, setIsReposted] = useState(post.reactions.isReposted);
  const [isCollected, setIsCollected] = useState(post.reactions.isCollected);
  const [isBookmarked, setIsBookmarked] = useState(post.reactions.isBookmarked);

  if (!hasReactions(post)) return null;

  const onLike = async () => {
    setIsLiked(!isLiked);
    const response = await fetch(`/api/posts/${post.id}/like`, {
      method: "POST",
    });
    const data = await response.json();
  };

  const onRepost = async () => {
    setIsReposted(!isReposted);
    // const response = await fetch(`/api/posts/${post.id}/repost`, {
    //   method: "POST",
    // });
    // const data = await response.json();
  };

  const onCollect = async () => {
    setIsCollected(!isCollected);
  };

  const onBookmark = async () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex flex-row items-center gap-12 w-full">
      <Link href={`/p/${post.id}`}>
        <ReactionBadge key={`${post.id}-comments`} reaction={"Comment"} amount={post.reactions.Comment} />
      </Link>
      <Button
        size="sm"
        variant="ghost"
        onClick={onRepost}
        className="h-max w-12 border-0 px-0 place-content-center items-center"
      >
        <ReactionBadge
          pressed={isReposted}
          key={`${post.id}-reposts`}
          reaction={"Repost"}
          amount={post.reactions.Repost}
        />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onLike}
        className="h-max w-12 border-0 px-0 place-content-center items-center"
      >
        <ReactionBadge
          pressed={isLiked}
          key={`${post.id}-upvotes`}
          reaction={"Upvote"}
          amount={post.reactions.Upvote}
        />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCollect}
        className="h-max w-12 border-0 px-0 place-content-center items-center"
      >
        <ReactionBadge
          pressed={isCollected}
          key={`${post.id}-collects`}
          reaction={"Collect"}
          amount={post.reactions.Collect}
        />
      </Button>
      <div className="grow" />
      <div className="flex flex-row opacity-0 group-hover:opacity-100 duration-300 delay-150">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBookmark}
          className="h-max w-12 border-0 px-0 place-content-center items-center"
        >
          <ReactionBadge
            pressed={isBookmarked}
            key={`${post.id}-bookmarks`}
            reaction={"Bookmark"}
            amount={post.reactions.Bookmark}
          />
        </Button>
      </div>
    </div>
  );
}

export const ReactionBadge = ({
  reaction,
  amount,
  pressed,
}: { reaction: PostReactionType; amount: number; pressed?: boolean }) => {
  const formatAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  const tooltipText = reaction.toLowerCase() + (amount === 1 ? "" : "s");
  const pressedStyle = pressed ? "font-semibold text-accent-foreground" : "";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`flex flex-row gap-1 leading-4 py-1 ${pressedStyle}`}>
            {amount > 0 && formatAmount}
            <ReactionIcon pressed={pressed} reaction={reaction} />
          </span>
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

export const ReactionIcon = ({ reaction, pressed }: { reaction: PostReactionType; pressed?: boolean }) => {
  switch (reaction) {
    case "Upvote":
      return pressed ? <HeartIcon strokeWidth={3.5} fill="hsl(var(--primary))" size={15} /> : <HeartIcon size={15} />;
    case "Downvote":
      return pressed ? (
        <ThumbsDownIcon strokeWidth={3.5} fill="hsl(var(--primary))" size={15} />
      ) : (
        <ThumbsDownIcon size={15} />
      );
    case "Repost":
      return pressed ? (
        <Repeat2Icon strokeWidth={3.5} color="hsl(var(--accent-foreground))" size={17} />
      ) : (
        <Repeat2Icon size={17} />
      );
    case "Comment":
      return <MessageSquareIcon size={15} />;
    case "Collect":
      return pressed ? (
        <CirclePlusIcon strokeWidth={3.5} color="hsl(var(--accent-foreground))" size={16} />
      ) : (
        <CirclePlusIcon size={16} />
      );
    case "Bookmark":
      return pressed ? (
        <BookmarkIcon strokeWidth={3.5} fill="hsl(var(--primary))" size={16} />
      ) : (
        <BookmarkIcon size={16} />
      );
    default:
      return <></>;
  }
};
