"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "./post/Post";
import { Button } from "./ui/button";
import { useUser } from "./user/UserContext";
import { ConnectWalletButton } from "./web3/WalletButtons";

export const FollowButton = ({ user, className }: { user: User; className?: string }) => {
  const [following, setFollowing] = useState(user.actions.followed);
  const followsMe = user.actions.following;
  const { user: authedUser } = useUser();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const toggleFollow = async () => {
    const followingNow = !following;
    setFollowing(!following);

    const result = await fetch(`/api/user/${user.id}/follow`, {
      method: "POST",
    });

    if (!result.ok) {
      toast.error(`${followingNow ? "Follow" : "Unfollow"} action failed: ${result.statusText} `);
      setFollowing(!following); // Revert to the original state
    } else {
      toast.success(`${followingNow ? "Followed" : "Unfollowed"} Successfully!`, { description: "Finalized on-chain" });
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant={following ? "outline" : "default"}
        onClick={() => {
          if (authedUser) {
            toggleFollow();
          } else {
            setIsWalletDialogOpen(true);
          }
        }}
        className={`font-semibold text-sm ${className}`}
        >
        {following ? "Following" : followsMe ? "Follow back" : "Follow"}
      </Button>
      {!authedUser && <ConnectWalletButton open={isWalletDialogOpen} setOpen={setIsWalletDialogOpen} />}
    </>
  );
};
