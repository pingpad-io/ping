"use client";

import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { FollowButton } from "../FollowButton";
import { LoadingSpinner } from "../LoadingSpinner";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import type { User } from "./User";
import { UserAvatar } from "./UserAvatar";

const fetchUserByHandle = async (handle: string): Promise<User> => {
  const response = await fetch(`/api/user/handle/${handle}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load user");
  }

  return data.user;
};

export const UserCard = ({ children, handle }: PropsWithChildren & { handle?: string }) => {
  const lowercasedHandle = handle?.toLowerCase();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", "handle", lowercasedHandle],
    queryFn: () => fetchUserByHandle(lowercasedHandle!),
    enabled: !!lowercasedHandle && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const isFollowingMe = user?.actions?.following;

  return (
    <HoverCard defaultOpen={false} onOpenChange={setIsOpen} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[20rem] not-prose" side="top">
        {isLoading && <LoadingSpinner />}
        {isError && <div>Error: {error?.message || "Failed to load user"}</div>}
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
