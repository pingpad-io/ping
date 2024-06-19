"use client";

import { useRef, useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import { toast } from "sonner";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

export const FollowButton = ({ user }: { user: User }) => {
  const [following, setFollowing] = useState(user.actions.followed);
  const controller = useRef<any>();

  const onInitHandler = ({ conductor }) => {
    controller.current = conductor;
  };

  const shootEffect = () => {
    if (!controller.current) return;
    controller.current.shoot();
  };

  const toggleFollow = async () => {
    const endpoint = following ? "/api/profile/unfollow" : "/api/profile/follow";

    const followingNow = !following;
    setFollowing(!following);

    if (followingNow) {
      shootEffect();
    }

    const result = await fetch(`${endpoint}?id=${user.id}`, {
      method: "POST",
    });

    if (!result.ok) {
      setFollowing(!following); // Revert to the original state
      toast.error(`${followingNow ? "Unfollow" : "Follow"} action failed: ${result.statusText} `);
    } else {
      toast.success(`${followingNow ? "Followed" : "Unfollowed"} Successfully!`, { description: "Finalized on-chain" });
    }
  };

  const decorateOptions = (defaultOptions) => {
    return {
      ...defaultOptions,
      colors: ["#fff", "#ccc", "#555"],
      scalar: 1,
      particleCount: 20,
      ticks: 75,
      startVelocity: 20,
      shapes: ["star", "circle"],
    };
  };

  return (
    <>
      <div className="relative z-0 h-10 w-24 items-center justify-center">
        <Button
          size="sm"
          variant={following ? "outline" : "default"}
          onClick={() => toggleFollow()}
          className="font-bold text-sm z-10 absolute right-0 top-0"
        >
          {following ? "Following" : "Follow"}
        </Button>

        <Explosion
          onInit={onInitHandler}
          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[5] select-none pointer-events-none"
          width={1000}
          height={1000}
          globalOptions={{ useWorker: true, disableForReducedMotion: true, resize: true }}
          decorateOptions={decorateOptions}
        />
      </div>
    </>
  );
};
