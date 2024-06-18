"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

export const FollowButton = ({ user }: { user: User }) => {
  const [following, setFollowing] = useState(user.actions.followed);

  const toggleFollow = async () => {
    const endpoint = following ? "/api/profile/unfollow" : "/api/profile/follow";

    setFollowing(!following);

    const result = await fetch(`${endpoint}?id=${user.id}`, {
      method: "POST",
    });

    if (!result.ok) {
      setFollowing(!following);
      toast.error(`${following ? "Unfollow" : "Follow"} action failed: ${result.statusText} `);
    } else {
      toast.success(`${following ? "Unfollowed" : "Followed"} Successfully!`);
    }
  };

  return (
    <Button size="sm" variant={following ? "outline" : "default"} onClick={() => toggleFollow()}>
      {following ? "Following" : "Follow"}
    </Button>
  );
};
