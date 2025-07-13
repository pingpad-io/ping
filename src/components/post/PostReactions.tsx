"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRef } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useCachedPost } from "~/hooks/useCachedPost";
import { usePostMutations } from "~/hooks/usePostMutations";
import { useExplosion } from "../ExplosionPortal";
import { ReactionButton } from "../ReactionButton";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { usePostStateContext } from "./PostStateContext";
import RepostDropdown from "./RepostDropdown";

export function ReactionsList({
  post: postProp,
  collapsed,
  isComment,
  isReplyOpen = false,
}: {
  post: Post;
  collapsed: boolean;
  isComment: boolean;
  isReplyOpen?: boolean;
}) {
  const { requireAuth } = useAuth();
  const post = useCachedPost(postProp);
  const { upvote } = usePostMutations(post.id, post);
  const { triggerExplosion } = useExplosion();
  const likeButtonRef = useRef<HTMLSpanElement>(null);
  const { context } = usePostStateContext();

  const handleLikeClick = () => {
    requireAuth(() => {
      if (!post.reactions.isUpvoted && likeButtonRef.current) {
        triggerExplosion("like", likeButtonRef.current);
      }
      upvote();
    });
  };

  return (
    <div className="flex flex-row items-center justify-between sm:justify-start gap-6 sm:gap-10 w-full -mb-2 mt-1">
      <div className="hover-expand rounded-full">
        <ReactionButton
          variant={isComment ? "comment" : "post"}
          reactionType="Comment"
          reaction={{
            count: post.reactions.Comment,
            isActive: isReplyOpen,
          }}
          onClick={() => requireAuth(() => context.handleReply())}
        />
      </div>
      <div className="hover-expand rounded-full">
        <RepostDropdown
          post={post}
          variant={isComment ? "comment" : "post"}
          reactions={{
            reacted: post.reactions.isReposted,
            count: post.reactions.Repost,
            canRepost: post.reactions?.canRepost || false,
            canQuote: post.reactions?.canQuote || false,
          }}
        />
      </div>
      <div className="hover-expand rounded-full">
        <span ref={likeButtonRef}>
          <ReactionButton
            variant={isComment ? "comment" : "post"}
            reactionType="Like"
            reaction={{
              count: post.reactions.upvotes || 0,
              isActive: post.reactions.isUpvoted || false,
            }}
            onClick={handleLikeClick}
          />
        </span>
      </div>

      {collapsed && (
        <div className="ml-auto">
          <Button size="sm" variant="ghost" className="h-max w-12 border-0 px-0 place-content-center items-center">
            <ChevronDownIcon className="h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
