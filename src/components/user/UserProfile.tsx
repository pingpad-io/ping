"use client";

import type { AccountStats } from "@lens-protocol/client";
import { CalendarIcon, EditIcon, MessageCircleIcon, VolumeXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "~/components/Link";
import { TimeSince } from "~/components/TimeLabel";
import { AvatarViewer } from "~/components/user/AvatarViewer";
import { FollowButton } from "../FollowButton";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { type User } from "./User";
import { UserFollowing } from "./UserFollowing";
import { useUser } from "./UserContext";
import { useFilteredUsers } from "../FilteredUsersContext";

export const UserProfile = ({ user, stats }: { user?: User; stats?: AccountStats | null }) => {
  if (!user) return null;

  const router = useRouter();
  const { user: authedUser } = useUser();
  const { removeFilteredUser } = useFilteredUsers();
  const [isHovered, setIsHovered] = useState(false);
  const isUserProfile = user.id === authedUser?.id;
  const isFollowingMe = user.actions.following;
  const isMuted = user.actions?.muted;
  const postsCount = (stats?.feedStats.posts ?? 0) + (stats?.feedStats.comments ?? 0);
  const followingCount = stats?.graphFollowStats.following ?? 0;
  const followersCount = stats?.graphFollowStats.followers ?? 0;

  const unmuteUser = async () => {
    removeFilteredUser(user.id);
    const result = await fetch(`/api/user/${user.id}/unmute`, {
      method: "POST",
    });
    const data = await result.json();
  
    if (result.ok) {
      toast.success("User unmuted successfully!");
      router.refresh();
    } else {
      toast.error(`${data.error}`);
    }
  };

  return (
    <div className="p-4 z-20 flex w-full flex-row gap-4 glass drop-shadow-md mt-4 rounded-xl">
      <div className="flex flex-col gap-2">
        <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
          <AvatarViewer user={user} />
        </div>
      </div>

      <div className="flex flex-col grow place-content-around">
        <div className="flex flex-row gap-2 items-center justify-between h-10">
          <span className="flex flex-row gap-2 items-center">
            <div className="text-lg font-bold w-fit truncate leading-none">{user.name}</div>
            <div className="text-sm text-base-content font-light leading-none">@{user.handle}</div>
            {isMuted && !isUserProfile && (
              <div
                className="flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={unmuteUser}
                  className={`h-6 px-2 transition-all duration-200 ${isHovered ? 'pr-2' : ''}`}
                >
                  <VolumeXIcon size={16} className="shrink-0" />
                  <span className={`text-xs ml-1 overflow-hidden transition-all duration-200 ${isHovered ? 'max-w-[45px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    Unmute
                  </span>
                </Button>
              </div>
            )}
            {isUserProfile && (
              <Link className="btn btn-square btn-sm btn-ghost" href="/settings">
                <EditIcon size={14} />
              </Link>
            )}
            {isFollowingMe && <Badge variant="secondary">Follows you</Badge>}
          </span>
          {!isUserProfile && <FollowButton user={user} />}
        </div>
        <div className="text-sm grow">
          <TruncatedText text={user.description} maxLength={300} isMarkdown={true} />
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <CalendarIcon size={14} />
          Joined <TimeSince date={new Date(user.createdAt)} />
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <MessageCircleIcon size={14} />
          {postsCount} Posts
        </div>
        <UserFollowing user={user} followingCount={followingCount} followersCount={followersCount} />
      </div>
    </div>
  );
};
