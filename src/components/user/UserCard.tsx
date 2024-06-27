"use client";

import { type ProfileId, useLazyProfile } from "@lens-protocol/react-web";
import type { PropsWithChildren } from "react";
import { FollowButton } from "../FollowButton";
import { LoadingSpinner } from "../LoadingIcon";
import { Badge } from "../ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import type { User } from "./User";
import { UserAvatar } from "./UserAvatar";
import Link from "next/link";

export const UserCard = ({ children, user }: PropsWithChildren & { user: User }) => {
  const { data, error, loading, execute } = useLazyProfile();
  const loadCard = () => {
    execute({ forProfileId: user.id as ProfileId });
  };
  const name = user?.name ?? "";
  const handle = user?.handle;
  const description = user?.description ?? "";
  // const _avatar = user?.profilePictureUrl;
  // const _banner = data?.metadata?.coverPicture?.optimized
  //   ? data?.metadata?.coverPicture?.optimized
  //   : data?.metadata?.coverPicture?.raw;
  const isFollowingMe = user.actions.following;
  const descriptionTruncated = description.length > 300 ? `${description.substring(0, 300)}...` : description;

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-full max-w-sm" side="top">
        {loading && !data && <LoadingSpinner />}
        {error && <div>Error: {error.message}</div>}
        {data && (
          <div className="flex flex-col gap-2">
            <Link href={`/u/${user.handle}`}>
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="w-10 h-10">
                <UserAvatar card={false} link={true} user={user} />
              </div>
              <span className="font-bold truncate">{name}</span>
              <span className="font-light truncate">@{handle}</span>
              <span className="grow" />
              <span>
                {isFollowingMe && (
                  <Badge className="text-xs h-fit w-fit" variant="secondary">
                    Follows you
                  </Badge>
                )}
              </span>
            </div>
            </Link>
            <span className="text-sm">{descriptionTruncated}</span>
            <span className="flex items-center justify-start pt-2">
              <FollowButton className="text-sm h-fit w-fit p-1 px-3" user={user} />
            </span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
