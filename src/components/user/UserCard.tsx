"use client";

import { useAccount } from "@lens-protocol/react";
import { type PropsWithChildren, useState } from "react";
import { FollowButton } from "../FollowButton";
import { LoadingSpinner } from "../LoadingSpinner";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { lensAcountToUser, type User } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserCard = ({ children, handle }: PropsWithChildren & { handle?: string }) => {
  const lowercasedHandle = handle?.toLowerCase();
  const { data, error, loading } = useAccount({ username: { localName: lowercasedHandle } });
  const [user, setUser] = useState<User | null>(null);

  const loadCard = () => {
    if (data) {
      setUser(lensAcountToUser(data));
    }
  };

  const isFollowingMe = user?.actions?.following;

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[20rem] not-prose" side="top">
        {(loading || !user) && <LoadingSpinner />}
        {error && <div>Error: {error}</div>}
        {user && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-start gap-2 text-base">
              <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 flex-shrink-0">
                  <UserAvatar card={false} user={user} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold truncate text-lg">{user.name}</span>
                  <span className="font-light text-sm truncate">@{user.handle}</span>
                  {isFollowingMe && (
                    <Badge className="text-sm h-fit w-fit mt-1" variant="secondary">
                      Follows you
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <span className="mt-2 leading-5">
              <TruncatedText className="text-sm" text={user.description} maxLength={200} isMarkdown={true} />
            </span>
            <div className="mt-3">
              <FollowButton className="w-full" user={user} />
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
