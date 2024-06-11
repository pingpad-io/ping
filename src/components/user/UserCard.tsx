"use client";

import { type ProfileId, useLazyProfile } from "@lens-protocol/react-web";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { LoadingSpinner } from "../LoadingIcon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { type User, lensProfileToUser } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserCard = ({ children, user }: PropsWithChildren & { user: User }) => {
  const { data, error, loading, execute } = useLazyProfile();
  const loadCard = () => {
    execute({ forProfileId: user.id as ProfileId });
  };
  const name = user?.name;
  const handle = user?.handle;
  const description = user?.description;
  // const _avatar = user?.profilePictureUrl;
  // const _banner = data?.metadata?.coverPicture?.optimized
  //   ? data?.metadata?.coverPicture?.optimized
  //   : data?.metadata?.coverPicture?.raw;

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top">
        {loading && !data && <LoadingSpinner />}
        {error && <div>Error: {error.message}</div>}
        {data && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="w-6 h-6">
                <UserAvatar user={user} />
              </div>
              <span className="font-bold">{name}</span>
              <span className="font-light">@{handle}</span>
            </div>
            <span className="text-sm">{description}</span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export const UserHandleCard = ({ children, handle }: PropsWithChildren & { handle: string }) => {
  const { data: profile, error, loading, execute } = useLazyProfile();

  const loadCard = () => {
    execute({ forHandle: `lens/${handle}` });
  };

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/u/${handle}`}>{children}</Link>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        {loading && !profile && <LoadingSpinner />}
        {error && <div>Error: {error.message}</div>}
        {profile && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="w-6 h-6">
                <UserAvatar user={lensProfileToUser(profile)} />
              </div>
              <span className="font-bold">{profile.metadata.displayName}</span>
              <span className="font-light">@{handle}</span>
            </div>
            <span className="text-sm">{profile.metadata.bio}</span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
