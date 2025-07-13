"use client";

import Link from "../Link";
import { Card } from "../ui/card";
import { User } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserView = ({ item }: { item: User }) => {
  return (
    <Link href={`/u/${item.handle}`}>
      <Card className="flex flex-row gap-3 p-3 transition-colors cursor-pointer">
        <div className="w-12 h-12">
          <UserAvatar user={item} />
        </div>
        <div className="flex flex-col justify-center">
          <b className="text-base">{item.name}</b>
          <span className="font-light text-sm text-muted-foreground">@{item.handle}</span>
        </div>
      </Card>
    </Link>
  );
};
