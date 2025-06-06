"use client";

import { User2Icon } from "lucide-react";
import { Feed } from "../Feed";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { type User } from "./User";
import { UserView } from "./UserView";

interface UserFollowingProps {
  user: User;
  followingCount: number;
  followersCount: number;
}

export const UserFollowing = ({ user, followingCount, followersCount }: UserFollowingProps) => {
  return (
    <div className="text-sm flex flex-row gap-1 place-items-center">
      <User2Icon size={14} />
      <Dialog>
        <DialogTrigger>
          Following <b>{followingCount}</b>
        </DialogTrigger>
        <DialogContent className="max-w-96">
          <DialogTitle className="text-lg font-bold">
            {user.handle}'s follows ({followingCount})
          </DialogTitle>
          <ScrollArea className="max-h-96">
            <Feed
              ItemView={UserView}
              endpoint={`/api/user/${user.id}/following`}
              initialCursor={undefined}
              initialData={undefined}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          Followers <b>{followersCount}</b>
        </DialogTrigger>
        <DialogContent className="max-w-96">
          <DialogTitle className="text-lg font-bold">
            {user.handle}'s followers ({followersCount})
          </DialogTitle>
          <ScrollArea className="max-h-96">
            <Feed
              ItemView={UserView}
              endpoint={`/api/user/${user.id}/followers`}
              initialCursor={undefined}
              initialData={undefined}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
