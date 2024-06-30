"use client";

import { useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { toast } from "sonner";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

export const FollowButton = ({ user, className }: { user: User; className?: string }) => {
  const [following, setFollowing] = useState(user.actions.followed);
  const followsMe = user.actions.following;
  const controller = useRef<any>();

  const onInitHandler = ({ conductor }) => {
    controller.current = conductor;
  };

  const shootEffect = () => {
    if (!controller.current) return;
    controller.current.shoot();
  };

  const toggleFollow = async () => {
    const followingNow = !following;
    setFollowing(!following);

    if (followingNow) {
      shootEffect();
    }

    const result = await fetch(`/api/profile/follow?id=${user.id}`, {
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
      <div className="relative z-0 items-center justify-center">
        <Button
          size="sm"
          variant={following ? "outline" : "default"}
          onClick={() => toggleFollow()}
          className={`font-bold text-sm z-10 absolute right-0 top-0 ${className}`}
        >
          {following ? "Following" : followsMe ? "Follow back" : "Follow"}
        </Button>

        {/* Hidden button to stretch the parent */}
        <Button
          size="sm"
          variant={following ? "outline" : "default"}
          onClick={() => {}}
          className={`font-bold text-sm right-0 top-0 ${className} display-none`}
        >
          {following ? "Following" : followsMe ? "Follow back" : "Follow"}
        </Button>
        {/* Hidden button to stretch the parent */}

        <Explosion
          onInit={onInitHandler}
          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[5] select-none pointer-events-none"
          width={1000}
          height={1000}
          globalOptions={{ useWorker: true, disableForReducedMotion: true, resize: true }}
          decorateOptions={(defaultOptions) => ({
            ...defaultOptions,
            colors: ["#fff", "#ccc", "#555"],
            scalar: 1,
            particleCount: 20,
            ticks: 75,
            startVelocity: 20,
            shapes: ["star", "circle"],
          })}
        />
      </div>
    </>
  );
};
