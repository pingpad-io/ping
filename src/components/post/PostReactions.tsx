"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import {
  ArrowBigDown,
  ArrowBigUp,
  BookmarkIcon,
  ChevronDownIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  Repeat2Icon,
  ThumbsDownIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";

export function ReactionsList({
  post,
  collapsed,
  isComment,
  isReplyWizardOpen,
  setReplyWizardOpen,
}: {
  post: Post;
  collapsed: boolean;
  isComment: boolean;
  isReplyWizardOpen: boolean;
  setReplyWizardOpen: (open: boolean) => void;
}) {
  const [isUpvoted, setIsUpvoted] = useState(post.reactions.isUpvoted);
  const [isDownvoted, setIsDownvoted] = useState(post.reactions.isDownvoted);
  const [isReposted, setIsReposted] = useState(post.reactions.isReposted);
  const [isCollected, setIsCollected] = useState(post.reactions.isCollected);
  const [isBookmarked, setIsBookmarked] = useState(post.reactions.isBookmarked);

  const [upvotes, setUpvotes] = useState(post.reactions.Upvote);
  const [downvotes, setDownvotes] = useState(post.reactions.Downvote);
  const [score, setScore] = useState(upvotes - downvotes);

  const [reposts, setReposts] = useState(post.reactions.Repost);
  const [comments] = useState(post.reactions.Comment);
  const [collects, setCollects] = useState(post.reactions.Collect);
  const [bookmarks, setBookmarks] = useState(post.reactions.Bookmark);

  const explosionController = useRef<any>();

  const onInitHandler = ({ conductor }) => {
    explosionController.current = conductor;
  };

  const shootEffect = () => {
    if (!explosionController.current) return;
    explosionController.current.shoot();
  };

  const onUpvote = async (e: any) => {
    e.stopPropagation();

    const isLikedNow = !isUpvoted;
    setIsUpvoted(isLikedNow);
    setUpvotes(isLikedNow ? upvotes + 1 : upvotes - 1);
    setScore(isLikedNow ? score + 1 : score - 1);
    isLikedNow ? shootEffect() : null;

    const response = await fetch(`/api/posts/${post.id}/upvote`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    if (result === undefined) {
      console.error("Failed to toggle upvote");
    }
  };

  const onDownvote = async (e: any) => {
    e.stopPropagation();

    const isDownvotedNow = !isDownvoted;
    setIsDownvoted(isDownvotedNow);
    setDownvotes(isDownvotedNow ? downvotes + 1 : downvotes - 1);
    setScore(isDownvotedNow ? score - 1 : score + 1);
    // isDownvotedNow ? shootEffect() : null;

    const response = await fetch(`/api/posts/${post.id}/downvote`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    if (result === undefined) {
      console.error("Failed to toggle downvote");
    }
  };

  const onRepost = async (e: any) => {
    e.stopPropagation();
    setReposts(reposts + 1);
    setIsReposted(true);
    const response = await fetch(`/api/posts/${post.id}/repost`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    setIsReposted(result);
  };

  const onCollect = async (e: any) => {
    e.stopPropagation();

    const isCollectedNow = !isCollected;
    setIsCollected(isCollectedNow);
    isCollectedNow ? setCollects(collects - 1) : null;

    const respone = await fetch(`/api/posts/${post.id}/collect`, {
      method: "POST",
    });
    const result = (await respone.json()).result;
    setIsCollected(result);
  };

  const onBookmark = async (e: any) => {
    e.stopPropagation();

    const isBookmarkedNow = !isBookmarked;
    setIsBookmarked(isBookmarkedNow);
    isBookmarkedNow ? setBookmarks(bookmarks + 1) : setBookmarks(bookmarks - 1);

    const response = await fetch(`/api/posts/${post.id}/bookmark`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    setIsBookmarked(result);
  };

  return (
    <div className="flex grow flex-row  grow justify-around w-full items-center -mb-2 -ml-2 mt-2">
      <div className="flex flex-row items-center gap-12 w-full">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setReplyWizardOpen(!isReplyWizardOpen);
          }}
          className="w-12 border-0 px-0 place-content-center items-center flex flex-row gap-1 h-full"
          disabled={!post.reactions.canComment}
        >
          <ReactionCount isPressed={false} amount={comments} persistent={false} />
          <ReactionBadge reaction={"Comment"} amount={comments} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRepost}
          className="w-12 border-0 px-0 place-content-center items-center flex flex-row gap-1 h-full"
          disabled={!post.reactions.canRepost}
        >
          <ReactionCount isPressed={isReposted} amount={reposts} persistent={false} />
          <ReactionBadge isPressed={isReposted} reaction={"Repost"} amount={reposts} />
        </Button>
        <span className="relative">
          {isComment ? (
            <span className="flex flex-row gap-1 h-full ">
              <Button
                size="sm"
                variant="ghost"
                onClick={onUpvote}
                className="h-max w-12 border-0 px-0 place-content-center items-center relative"
              >
                <ReactionBadge isPressed={isUpvoted} reaction={"Upvote"} amount={upvotes} />
              </Button>

              <ReactionCount isPressed={isUpvoted || isDownvoted} amount={score} persistent={true} />

              <Button
                size="sm"
                variant="ghost"
                onClick={onDownvote}
                className="h-max w-12 border-0 px-0 place-content-center items-center relative"
              >
                <ReactionBadge isPressed={isDownvoted} reaction={"Downvote"} amount={downvotes} />
              </Button>
            </span>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={onUpvote}
              className="w-12 border-0 px-0 place-content-center items-center flex flex-row gap-1 h-full"
            >
              <ReactionCount isPressed={isUpvoted} amount={upvotes} persistent={false} />
              <ReactionBadge isPressed={isUpvoted} reaction={"Like"} amount={upvotes} />
            </Button>
          )}
          <Explosion
            onInit={onInitHandler}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[30] select-none pointer-events-none"
            width={1000}
            height={1000}
            globalOptions={{ useWorker: true, disableForReducedMotion: true, resize: true }}
            decorateOptions={(defaultOptions) => ({
              ...defaultOptions,
              colors: ["#fff", "#ccc", "#555"],
              scalar: 1,
              particleCount: 15,
              ticks: 60,
              startVelocity: 8,
              shapes: ["star", "circle", "square"],
            })}
          />
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCollect}
          className={`w-12 border-0 px-0 place-content-center items-center flex flex-row gap-1 h-full ${
            post.reactions.canCollect ? "" : "opacity-0 pointer-events-none"
          }`}
        >
          <ReactionCount isPressed={isCollected} amount={collects} persistent={false} />
          <ReactionBadge isPressed={isCollected} reaction={"Collect"} amount={collects} />
        </Button>
        <div className="grow" />
        <div className="flex flex-row items-center gap-2 ">
          <div className="flex flex-row opacity-0 group-hover:opacity-100 duration-300 delay-150">
            {!collapsed && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onBookmark}
                className="h-max w-12 border-0 px-0 place-content-center items-center"
              >
                <ReactionBadge isPressed={isBookmarked} reaction={"Bookmark"} amount={bookmarks} />
              </Button>
            )}
          </div>
          {collapsed && (
            <Button size="sm" variant="ghost" className={"h-max w-12 border-0 px-0 place-content-center items-center"}>
              <ChevronDownIcon className="h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const ReactionCount = ({
  amount,
  isPressed,
  persistent = false,
}: { amount: number; isPressed: boolean; persistent: boolean }) => {
  if (amount <= 0 && !persistent) {
    return <></>;
  }
  const formattedAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  const pressedStyle = isPressed ? "font-semibold text-accent-foreground" : "";
  return <span className={`${pressedStyle}`}>{formattedAmount}</span>;
};

export const ReactionBadge = ({
  reaction,
  amount,
  isPressed,
}: { reaction: PostReactionType | "Like"; amount: number; isPressed?: boolean }) => {
  const tooltipText = reaction.toLowerCase() + (amount === 1 ? "" : "s");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ReactionIcon pressed={isPressed} reaction={reaction} />
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

export const ReactionIcon = ({ reaction, pressed }: { reaction: PostReactionType | "Like"; pressed?: boolean }) => {
  switch (reaction) {
    case "Like":
      return pressed ? <HeartIcon strokeWidth={3.5} fill="hsl(var(--primary))" size={15} /> : <HeartIcon size={15} />;
    case "Upvote":
      return pressed ? <ArrowBigUp strokeWidth={3.5} fill="hsl(var(--primary))" size={20} /> : <ArrowBigUp size={20} />;
    case "Downvote":
      return pressed ? (
        <ArrowBigDown strokeWidth={3.5} fill="hsl(var(--primary))" size={20} />
      ) : (
        <ArrowBigDown size={20} />
      );
    case "Repost":
      return pressed ? (
        <Repeat2Icon strokeWidth={3.5} color="hsl(var(--accent-foreground))" size={18} />
      ) : (
        <Repeat2Icon strokeWidth={1.8} size={18} />
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
