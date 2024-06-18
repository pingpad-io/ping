"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

export const FollowButton = ({ user }: {user: User}) => {
  const [following, setFollowing] = useState(user.actions.followed);

  const toggleFollow = async () => {
    setFollowing(!following);

    const result = await fetch(`/api/profile/follow?id=${user.id}`, {
      method: "POST",
    });

    if (!result.ok) {
      setFollowing(!following);
      toast.error(`Failed to follow: ${result.statusText} `);
    } else {
      toast.success("Followed successfully!");
    }
  };

  return (
    <Button size="sm" variant={following ? "outline" : "default"} onClick={() => toggleFollow()}>
      {following ? "Following" : "Follow"}
    </Button>
  );
};
