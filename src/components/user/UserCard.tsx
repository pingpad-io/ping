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
      <HoverCardContent className="w-full max-w-sm" side="top">
        {(loading || !user) && <LoadingSpinner />}
        {error && <div>Error: {error}</div>}
        {user && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="w-8 h-8">
                <UserAvatar card={false} user={user} />
              </div>
              <span className="flex flex-col">
                <span className="font-bold">{user.name}</span>
                <span className="font-light text-xs">@{user.handle}</span>
              </span>
              <span>
                {isFollowingMe && (
                  <Badge className="text-xs h-fit w-fit" variant="secondary">
                    Follows you
                  </Badge>
                )}
              </span>
            </div>
            <span className="text-xs leading-4">
              <TruncatedText text={user.description} maxLength={200} isMarkdown={true} />
            </span>
            <span className="flex items-center justify-start pt-2">
              <FollowButton className="text-sm h-fit w-fit p-1 px-3" user={user} />
            </span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
