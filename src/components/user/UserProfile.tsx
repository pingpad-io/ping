import type { AccountStats } from "@lens-protocol/client";
import { CalendarIcon, EditIcon, MessageCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "~/components/Link";
import { TimeSince } from "~/components/TimeLabel";
import { AvatarViewer } from "~/components/user/AvatarViewer";
import { getServerAuth } from "~/utils/getServerAuth";
import { FollowButton } from "../FollowButton";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { type User } from "./User";
import { UserFollowing } from "./UserFollowing";

export const UserProfile = async ({ user, stats }: { user?: User; stats?: AccountStats | null }) => {
  if (!user) return notFound();

  const { user: authedUser } = await getServerAuth();
  const isUserProfile = user.id === authedUser?.id;
  const isFollowingMe = user.actions.following;
  const postsCount = (stats?.feedStats.posts ?? 0) + (stats?.feedStats.comments ?? 0);
  const followingCount = stats?.graphFollowStats.following ?? 0;
  const followersCount = stats?.graphFollowStats.followers ?? 0;

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
            <div className="text-lg font-bold w-fit truncate">{user.name}</div>
            <div className="text-sm text-base-content font-light">@{user.handle}</div>
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
