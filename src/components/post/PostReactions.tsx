"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import {
  BookmarkIcon,
  ChevronDownIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  Repeat2Icon,
  ThumbsDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";

export function ReactionsList({
  post,
  collapsed,
  isReplyWizardOpen,
  setReplyWizardOpen,
}: {
  post: Post;
  collapsed: boolean;
  isReplyWizardOpen:boolean;
  setReplyWizardOpen: (open: boolean) => void;
}) {
  const [isLiked, setIsLiked] = useState(post.reactions.isUpvoted);
  const [isReposted, setIsReposted] = useState(post.reactions.isReposted);
  const [isCollected, setIsCollected] = useState(post.reactions.isCollected);
  const [isBookmarked, setIsBookmarked] = useState(post.reactions.isBookmarked);

  const [likes, setLikes] = useState(post.reactions.Upvote);
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

  const onLike = async (e: any) => {
    e.stopPropagation();

    const isLikedNow = !isLiked;
    setIsLiked(isLikedNow);
    setLikes(isLikedNow ? likes + 1 : likes - 1);
    isLikedNow ? shootEffect() : null;

    const response = await fetch(`/api/posts/${post.id}/like`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    if (!result) {
      console.error("Failed to like post");
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
          className="h-max w-12 border-0 px-0 place-content-center items-center"
          disabled={!post.reactions.canComment}
        >
          <ReactionBadge key={`${post.id}-comments`} reaction={"Comment"} amount={comments} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRepost}
          className="h-max w-12 border-0 px-0 place-content-center items-center"
          disabled={!post.reactions.canRepost}
        >
          <ReactionBadge pressed={isReposted} key={`${post.id}-reposts`} reaction={"Repost"} amount={reposts} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onLike}
          className="h-max w-12 border-0 px-0 place-content-center items-center relative"
        >
          <ReactionBadge pressed={isLiked} key={`${post.id}-upvotes`} reaction={"Upvote"} amount={likes} />

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
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCollect}
          className={`h-max w-12 border-0 px-0 place-content-center items-center ${
            post.reactions.canCollect ? "" : "opacity-0 pointer-events-none"
          }`}
        >
          <ReactionBadge pressed={isCollected} key={`${post.id}-collects`} reaction={"Collect"} amount={collects} />
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
                <ReactionBadge
                  pressed={isBookmarked}
                  key={`${post.id}-bookmarks`}
                  reaction={"Bookmark"}
                  amount={bookmarks}
                />
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
