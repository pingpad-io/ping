"use client";

import { useAccount } from "@lens-protocol/react";
import { type PropsWithChildren, useState } from "react";
import { FollowButton } from "../FollowButton";
import { LoadingSpinner } from "../LoadingSpinner";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { type User, lensAcountToUser } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserCard = ({ children, handle }: PropsWithChildren & { handle?: string }) => {
  const { data, error, loading } = useAccount({ username: { localName: handle } });
  const [user, setUser] = useState<User | null>(null);

  const loadCard = () => {
    if (data) {
      setUser(lensAcountToUser(data));
    }
  };

  // const _avatar = user?.profilePictureUrl;
  // const _banner = data?.metadata?.coverPicture?.optimized
  //   ? data?.metadata?.coverPicture?.optimized
  //   : data?.metadata?.coverPicture?.raw;
  const isFollowingMe = user?.actions?.following;

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-full max-w-sm z-50 min-w-[18rem] p-4 not-prose" side="top">
        {(loading || !user) && <LoadingSpinner />}
        {error && <div>Error: {error}</div>}
        {user && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-start justify-between gap-2 text-sm">
              <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 flex-shrink-0">
                  <UserAvatar card={false} user={user} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold truncate">{user.name}</span>
                  <span className="font-light text-xs truncate">@{user.handle}</span>
                  {isFollowingMe && (
                    <Badge className="text-xs h-fit w-fit mt-1" variant="secondary">
                      Follows you
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <FollowButton className="text-sm h-fit w-fit p-1 px-3" user={user} />
              </div>
            </div>
            <span className="text-xs leading-4">
              <TruncatedText className="text-xs" text={user.description} maxLength={200} isMarkdown={true} />
            </span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
