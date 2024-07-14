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
} from "lucide-react";
import { useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";

type ReactionState = {
  [key in PostReactionType | "Like"]: {
    count: number;
    isActive: boolean;
  };
} & {
  score: number;
};

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
  const [reactions, setReactions] = useState<ReactionState>({
    score: post.reactions.Upvote - post.reactions.Downvote,
    Upvote: { count: post.reactions.Upvote, isActive: post.reactions.isUpvoted },
    Downvote: { count: post.reactions.Downvote, isActive: post.reactions.isDownvoted },
    Repost: { count: post.reactions.Repost, isActive: post.reactions.isReposted },
    Comment: { count: post.reactions.Comment, isActive: false },
    Collect: { count: post.reactions.Collect, isActive: post.reactions.isCollected },
    Bookmark: { count: post.reactions.Bookmark, isActive: post.reactions.isBookmarked },
    Like: { count: post.reactions.Upvote, isActive: post.reactions.isUpvoted },
  });

  const explosionController = useRef<any>();

  const onInitHandler = ({ conductor }) => {
    explosionController.current = conductor;
  };

  const shootEffect = () => {
    if (explosionController.current) {
      explosionController.current.shoot();
    }
  };

  const updateReaction = async (reactionType: PostReactionType | "Like") => {
    if (reactionType === "Upvote" || reactionType === "Downvote") {
      setReactions((prev) => {
        const isUpvote = reactionType === "Upvote";
        const isActive = isUpvote ? prev.Upvote.isActive : prev.Downvote.isActive;
        const otherIsActive = isUpvote ? prev.Downvote.isActive : prev.Upvote.isActive;
        let scoreDelta = isActive ? -1 : 1;

        if (otherIsActive) {
          scoreDelta *= 2;
        }

        return {
          ...prev,
          score: prev.score + (isUpvote ? scoreDelta : -scoreDelta),
          Upvote: {
            count: prev.Upvote.count + (isUpvote ? (isActive ? -1 : 1) : 0),
            isActive: isUpvote && !isActive
          },
          Downvote: {
            count: prev.Downvote.count + (!isUpvote ? (isActive ? -1 : 1) : 0),
            isActive: !isUpvote && !isActive
          },

        };
      });
    } else {
      setReactions((prev) => ({
        ...prev,
        [reactionType]: {
          count: prev[reactionType].count + (prev[reactionType].isActive ? -1 : 1),
          isActive: !prev[reactionType].isActive,
        },
      }));
    }

    if (!reactions[reactionType]?.isActive) shootEffect();
    console.log(post.id, `/api/posts/${post.id}/${reactionType.toLowerCase()}`);

    const route = reactionType === "Like" ? "upvote" : reactionType.toLowerCase()
    const response = await fetch(`/api/posts/${post.id}/${route}`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    if (result === undefined) {
      console.error(`Failed to toggle ${reactionType}`);
    }
  };

  return (
    <div className="flex grow flex-row grow justify-around w-full items-center -mb-2 -ml-2 mt-2">
      <div className="flex flex-row items-center gap-12 w-full">
        <ReactionButton
          reactionType="Comment"
          reaction={reactions.Comment}
          onClick={() => setReplyWizardOpen(!isReplyWizardOpen)}
          disabled={!post.reactions.canComment}
        />
        <ReactionButton
          reactionType="Repost"
          reaction={reactions.Repost}
          onClick={() => updateReaction("Repost")}
          disabled={!post.reactions.canRepost}
        />
        <span className="relative">
          {isComment ? (
            <span className="flex flex-row gap-1 h-full">
              <ReactionButton
                reactionType="Upvote"
                reaction={{ count: reactions.score, isActive: reactions.Upvote.isActive }}
                onClick={() => updateReaction("Upvote")}
              />
              <ReactionCount
                isPressed={reactions.Upvote.isActive || reactions.Downvote.isActive}
                amount={reactions.score}
                persistent={true}
              />
              <ReactionButton
                reactionType="Downvote"
                reaction={{ count: reactions.score, isActive: reactions.Downvote.isActive }}
                onClick={() => updateReaction("Downvote")}
              />
            </span>
          ) : (
            <ReactionButton reactionType="Like" reaction={reactions.Like} onClick={() => updateReaction("Like")} />
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
        <div className={`${post.reactions.canCollect ? "" : "opacity-0 pointer-events-none"}`}>
          <ReactionButton
            reactionType="Collect"
            reaction={reactions.Collect}
            onClick={() => updateReaction("Collect")}
          />
        </div>
        <div className="grow" />
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row opacity-0 group-hover:opacity-100 duration-300 delay-150">
            {!collapsed && (
              <ReactionButton
                reactionType="Bookmark"
                reaction={reactions.Bookmark}
                onClick={() => updateReaction("Bookmark")}
              />
            )}
          </div>
          {collapsed && (
            <Button size="sm" variant="ghost" className="h-max w-12 border-0 px-0 place-content-center items-center">
              <ChevronDownIcon className="h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type ReactionButtonProps = {
  reactionType: PostReactionType | "Like";
  reaction: { count: number; isActive: boolean };
  onClick: () => void;
  disabled?: boolean;
};

const ReactionButton: React.FC<ReactionButtonProps> = ({ reactionType, reaction, onClick, disabled = false }) => (
  <Button
    size="sm"
    variant="ghost"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="w-12 border-0 px-0 place-content-center items-center flex flex-row gap-1 h-full"
    disabled={disabled}
  >
    {reactionType !== "Upvote" && reactionType !== "Downvote" && (
      <ReactionCount isPressed={reaction.isActive} amount={reaction.count} persistent={false} />
    )}
    <ReactionBadge isPressed={reaction.isActive} reaction={reactionType} amount={reaction.count} />
  </Button>
);

export const ReactionCount = ({
  amount,
  isPressed,
  persistent = false,
}: {
  amount: number;
  isPressed: boolean;
  persistent: boolean;
}) => {
  if (amount <= 0 && !persistent) return null;

  const formattedAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  return <span className={isPressed ? "font-semibold text-accent-foreground" : ""}>{formattedAmount}</span>;
};

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

export const ReactionIcon = ({ reaction, pressed }: { reaction: PostReactionType | "Like"; pressed?: boolean }) => {
  const iconProps = pressed ? { strokeWidth: 3.5, fill: "hsl(var(--primary))" } : {};
  const icons = {
    Like: <HeartIcon size={15} {...iconProps} />,
    Upvote: <ArrowBigUp size={20} {...iconProps} />,
    Downvote: <ArrowBigDown size={20} {...iconProps} />,
    Repost: (
      <Repeat2Icon
        size={18}
        strokeWidth={pressed ? 3.5 : 1.8}
        color={pressed ? "hsl(var(--accent-foreground))" : undefined}
      />
    ),
    Comment: <MessageSquareIcon size={15} />,
    Collect: (
      <CirclePlusIcon
        size={16}
        strokeWidth={pressed ? 3.5 : 1.8}
        color={pressed ? "hsl(var(--accent-foreground))" : undefined}
      />
    ),
    Bookmark: <BookmarkIcon size={16} {...iconProps} />,
  };

  return icons[reaction] || null;
};
