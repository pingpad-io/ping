"use client";

import { useLazyProfile } from "@lens-protocol/react-web";
import { useState } from "react";
import Link from "~/components/Link";
import { LoadingSpinner } from "../LoadingIcon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { type User, lensProfileToUser } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserLazyHandle = ({ handle }: { handle: string }) => {
  const { data: profile, error, loading, execute } = useLazyProfile();
  const [user, setUser] = useState<User | null>(null);

  const loadCard = () => {
    execute({ forHandle: `lens/${handle}` }).then((res) => {
      if (res.isSuccess()) {
        setUser(lensProfileToUser(res.unwrap()));
      }
    });
  };

  return (
    <HoverCard defaultOpen={false} onOpenChange={(open: boolean) => open && loadCard()} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/u/${handle}`}>@{handle}</Link>
      </HoverCardTrigger>
      <HoverCardContent className="p-3" side="top">
        {loading && !profile && <LoadingSpinner />}
        {error && <div>Error: {error.message}</div>}
        {user && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="w-8 h-8">
                <UserAvatar link={false} card={false} user={user} />
              </div>
              <span className="font-bold">{user.name}</span>
              <span className="font-light">@{user.handle}</span>
            </div>
            <span className="text-sm">{user.description}</span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
