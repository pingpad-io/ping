"use client";

import { toast } from "sonner";
import { useAuth } from "~/hooks/useAuth";
import { useUserMutations } from "~/hooks/useUserMutations";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

export const FollowButton = ({ user, className }: { user: User; className?: string }) => {
  const following = user.actions.followed;
  const followsMe = user.actions.following;
  const { requireAuth } = useAuth();
  const { follow } = useUserMutations(user.id);

  const toggleFollow = async () => {
    try {
      await follow();
      toast.success(`${!following ? "Followed" : "Unfollowed"} Successfully!`, { 
        description: "Finalized on-chain" 
      });
    } catch (error) {
      toast.error(`${!following ? "Follow" : "Unfollow"} action failed`);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant={following ? "outline" : "default"}
        onClick={() => {
          requireAuth(toggleFollow);
        }}
        className={`font-semibold text-sm ${className}`}
      >
        {following ? "Following" : followsMe ? "Follow back" : "Follow"}
      </Button>
    </>
  );
};