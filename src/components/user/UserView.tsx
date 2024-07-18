"use client";

import Link from "../Link";
import { Card } from "../ui/card";
import { User } from "./User";
import { UserAvatar } from "./UserAvatar";

export const UserView = ({ item }: { item: User }) => {
  return (
    <Link href={`/u/${item.handle}`}>
      <Card className="flex flex-row gap-2 p-2">
        <div className="w-10 h-10">
          <UserAvatar user={item} />
        </div>
        <div className="flex flex-col">
          <b>{item.name}</b>
          <span className="font-light text-sm">@{item.handle}</span>
        </div>
      </Card>
    </Link>
  );
};
