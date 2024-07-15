import { CalendarIcon, EditIcon, MessageCircleIcon, PawPrintIcon, User2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "~/components/Link";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/user/UserAvatar";
import { getLensClient } from "~/utils/getLensClient";
import { FollowButton } from "../FollowButton";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { type User, parseInterests } from "./User";
import { UserInterestsList } from "./UserInterests";

export const UserProfile = async ({ user }: { user?: User }) => {
  if (!user) return notFound();

  const { user: authedUser } = await getLensClient();
  const isUserProfile = user.id === authedUser.id;
  const isFollowingMe = user.actions.following;

  const commonInterestTypes = user.interests
    .map((interest) => interest.value)
    .filter((interest) => authedUser?.interests?.map((interest) => interest.value).includes(interest));
  const commonInterests = parseInterests(commonInterestTypes);

  return (
    <div className="p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
          <UserAvatar card={false} user={user} />
        </div>
      </div>

      <div className="flex flex-col grow place-content-around">
        <div className="flex flex-row gap-2 items-center justify-between h-10">
          <span className="flex flex-row gap-2 items-center">
            <div className="text-lg font-bold w-fit truncate">{user.name}</div>
            <div className="text-sm text-base-content font-light">@{user.handle}</div>
            {isUserProfile && (
              <Link className="btn btn-square btn-sm btn-ghost" href="/settings">
                <EditIcon size={14} />
              </Link>
            )}
            {isFollowingMe && <Badge variant="secondary">Follows you</Badge>}
          </span>
          {!isUserProfile && <FollowButton user={user} />}
        </div>
        <div className="text-sm grow">
          <TruncatedText text={user.description} maxLength={300} isMarkdown={true} />
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
            <DialogTrigger>
              {user.interests.length} Interests
              {!isUserProfile && <> ({commonInterestTypes.length} in common)</>}
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-lg font-bold">{user.handle}'s interests</DialogTitle>
              <UserInterestsList interests={user.interests} />
              {commonInterests.length > 0 && !isUserProfile && (
                <>
                  <Separator />
                  <DialogHeader className="text-lg font-bold">
                    {commonInterests.length} interests in common:
                  </DialogHeader>
                  <UserInterestsList interests={commonInterests} />
                </>
              )}
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
