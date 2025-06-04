"use client";

import confetti from "canvas-confetti";
import { ChevronDownIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { ReactionButton } from "../ReactionButton";
import { ReactionCount } from "../ReactionCount";
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
  isCommentsOpen,
  setCommentsOpen,
}: {
  post: Post;
  collapsed: boolean;
  isComment: boolean;
  isCommentsOpen: boolean;
  setCommentsOpen: (open: boolean) => void;
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

  const heartShape = useMemo(
    () =>
      confetti.shapeFromPath({
        path: "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z",
      }),
    [],
  );

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
            isActive: isUpvote && !isActive,
          },
          Downvote: {
            count: prev.Downvote.count + (!isUpvote ? (isActive ? -1 : 1) : 0),
            isActive: !isUpvote && !isActive,
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

    // Fire explosion only for Like and Upvote
    if (["Like", "Upvote"].includes(reactionType) && !reactions[reactionType]?.isActive) {
      shootEffect();
    }

    const route = reactionType === "Like" ? "upvote" : reactionType.toLowerCase();
    const response = await fetch(`/api/posts/${post.id}/${route}`, {
      method: "POST",
    });
    const result = (await response.json()).result;
    if (result === undefined) {
      console.error(`Failed to toggle ${reactionType}`);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between sm:justify-start gap-3 sm:gap-12 w-full -mb-2 -ml-2 mt-2">
      <ReactionButton
        variant={isComment ? "comment" : "post"}
        reactionType="Comment"
        reaction={reactions.Comment}
        onClick={() => setCommentsOpen(!isCommentsOpen)}
        disabled={!post.reactions.canComment}
      />
      <ReactionButton
        variant={isComment ? "comment" : "post"}
        reactionType="Repost"
        reaction={reactions.Repost}
        onClick={() => updateReaction("Repost")}
        disabled={!post.reactions.canRepost}
      />
      <span className="relative overflow-shown">
        {isComment ? (
          <span className="flex flex-row gap-1 ">
            <ReactionButton
              variant="comment"
              reactionType="Upvote"
              reaction={{ count: reactions.score, isActive: reactions.Upvote.isActive }}
              onClick={() => updateReaction("Upvote")}
            />
            <span className="-mx-2">
              <ReactionCount
                isPressed={reactions.Upvote.isActive || reactions.Downvote.isActive}
                amount={reactions.score}
                persistent={true}
              />
            </span>
            <ReactionButton
              variant="comment"
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
          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[50] select-none pointer-events-none"
          width={400}
          height={400}
          globalOptions={{ useWorker: true, disableForReducedMotion: true, resize: true }}
          decorateOptions={(defaultOptions) => ({
            ...defaultOptions,
            colors: ["#ff4d6d", "#ff82a9", "#ffa1c0"],
            scalar: 1,
            particleCount: 15,
            ticks: 60,
            startVelocity: 8,
            flat: true,
            shapes: [heartShape],
          })}
        />
      </span>

      <div className="ml-auto">
        <div className="opacity-0 group-hover:opacity-100 duration-300 delay-150">
          {!collapsed && (
            <ReactionButton
              variant={isComment ? "comment" : "post"}
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
  );
}
