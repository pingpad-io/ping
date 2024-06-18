import { CalendarIcon, EditIcon, MessageCircleIcon, PawPrintIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import Markdown from "~/components/Markdown";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/user/UserAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import type { User } from "./User";
import { UserInterestsList } from "./UserInterests";

export const UserProfile = ({ user, isUserProfile }: { user: User; isUserProfile: boolean }) => {
  if (!user) throw new Error("∑(O_O;) Profile not found");

  return (
    <div className="sticky top-0 p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
      <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
        <UserAvatar card={false} user={user} />
      </div>

      <div className="flex flex-col grow place-content-around">
        <div className="flex flex-row gap-2 place-items-center h-6">
          <div className="text-lg font-bold w-fit truncate">{user.name}</div>
          <div className="text-sm text-base-content font-light">@{user.handle}</div>
          {isUserProfile && (
            <Link className="btn btn-square btn-sm btn-ghost" href="/settings">
              <EditIcon size={14} />
            </Link>
          )}
        </div>
        <div className="text-sm grow">
          <Markdown content={user.description} />
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <CalendarIcon size={14} />
          Joined <TimeSince date={new Date(user.createdAt)} />
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <MessageCircleIcon size={14} />
          {user.stats.posts + user.stats.comments} Posts
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <PawPrintIcon size={14} />
          <Dialog>
            <DialogTrigger>{user.interests.length} Interests</DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-lg font-bold">{user.handle}'s interests</DialogHeader>
              <UserInterestsList interests={user.interests} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm flex flex-row gap-1 place-items-center">
          <User2Icon size={14} />
          Following <b>{user.stats.following}</b>
          Followers <b>{user.stats.followers}</b>
        </div>
      </div>
    </div>
  );
};
