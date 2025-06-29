"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useExplosion } from "../ExplosionPortal";
import { ReactionButton } from "../ReactionButton";
import { Button } from "../ui/button";
import type { Post, PostReactionType } from "./Post";
import RepostDropdown from "./RepostDropdown";

type ReactionState = {
  [key in PostReactionType | "Like"]: {
    count: number;
    isActive: boolean;
  };
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
    Repost: { count: post.reactions.Repost, isActive: post.reactions.isReposted },
    Comment: { count: post.reactions.Comment, isActive: false },
    Collect: { count: post.reactions.Collect, isActive: post.reactions.isCollected },
    Bookmark: { count: post.reactions.Bookmark, isActive: post.reactions.isBookmarked },
    Like: { count: post.reactions.upvotes || 0, isActive: post.reactions.isUpvoted || false },
  });

  const { triggerExplosion } = useExplosion();
  const likeButtonRef = useRef<HTMLSpanElement>(null);

  const updateReaction = async (reactionType: PostReactionType | "Like") => {
    setReactions((prev) => ({
      ...prev,
      [reactionType]: {
        count: prev[reactionType].count + (prev[reactionType].isActive ? -1 : 1),
        isActive: !prev[reactionType].isActive,
      },
    }));

    if (reactionType === "Like") {
      const wasActive = reactions.Like.isActive;
      if (!wasActive && likeButtonRef.current) {
        triggerExplosion("like", likeButtonRef.current);
      }
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
    <div className="flex flex-row items-center justify-between sm:justify-start gap-6 sm:gap-10 w-full -mb-2 mt-1">
      <ReactionButton
        variant={isComment ? "comment" : "post"}
        reactionType="Comment"
        reaction={reactions.Comment}
        onClick={() => setCommentsOpen(!isCommentsOpen)}
        disabled={!post.reactions?.canComment}
      />
      <RepostDropdown
        post={post}
        variant={isComment ? "comment" : "post"}
        reactions={{
          reacted: reactions.Repost.isActive,
          count: reactions.Repost.count,
          canRepost: post.reactions?.canRepost || false,
          canQuote: post.reactions?.canQuote || false,
        }}
        onRepostChange={(isReposted, count) => {
          setReactions((prev) => ({
            ...prev,
            Repost: { count, isActive: isReposted },
          }));
        }}
      />
      <span ref={likeButtonRef}>
        <ReactionButton
          variant={isComment ? "comment" : "post"}
          reactionType="Like"
          reaction={reactions.Like}
          onClick={() => updateReaction("Like")}
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
