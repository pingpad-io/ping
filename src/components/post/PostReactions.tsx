"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRef } from "react";
import { useUser } from "~/components/user/UserContext";
import { useCachedPost } from "~/hooks/useCachedPost";
import { usePostMutations } from "~/hooks/usePostMutations";
import type { Post } from "~/lib/types/post";
import { useExplosion } from "../ExplosionPortal";
import { ReactionButton } from "../ReactionButton";
import { Button } from "../ui/button";
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
  const { requireAuth } = useUser();
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
    <div className="flex flex-row items-center justify-between sm:justify-start gap-6 sm:gap-10 w-full -mb-2">
      <ReactionButton
        variant={isComment ? "comment" : "post"}
        reactionType="Comment"
        reaction={{
          count: post.reactions.Comment,
          isActive: isReplyOpen,
        }}
        onClick={() => requireAuth(() => context.handleReply())}
      />
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

      {collapsed && (
        <div className="ml-auto">
          <Button
            size="sm"
            variant="ghost"
            className="h-max w-12 border-0 px-0 place-content-center items-center hover:bg-transparent hover:scale-105 active:scale-95 data-[state=open]:scale-95 button-hover-bg button-hover-bg-equal"
          >
            <ChevronDownIcon className="h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
