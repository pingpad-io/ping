import {
  AtSignIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
  Repeat2Icon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { UserAvatarArray } from "../user/UserAvatar";
import { Notification } from "./Notification";

export const NotificationView = ({ notification }: { notification: Notification }) => {
  const post = (
    <Link className="hover:underline" href={`/p/${notification?.actedOn?.id}`}>
      post
    </Link>
  );

  // biome-ignore format: compact
  const notificationTextMap = {
    Reaction: <> liked <HeartIcon className="-mb-0.5" size={16} /> your{post} </>,
    Comment: <> commented <MessageSquareIcon className="-mb-0.5" size={16} /> on your{post}</>,
    Follow: <> started following <UserPlusIcon className="-mb-0.5" size={16} /> you</>,
    Mention: <> mentioned <AtSignIcon className="-mb-0.5" size={16} /> you in their{post}</>,
    Repost: <> reposted <Repeat2Icon className="-mb-0.5" size={16} /> your{post} </>,
    Action: <> acted <CirclePlusIcon className="-mb-0.5" size={16} /> on your{post} </>,
    Quote: <> quoted <MessageSquareQuoteIcon className="-mb-0.5" size={16} /> your{post} </>,
  };

  // biome-ignore format: keep it compact
  const notificationTextInverse = {
    Reaction: <><HeartIcon className="-mb-0.5" size={16} />liked your{post}</>,
    Comment: <><MessageSquareIcon  className="-mb-0.5" size={16} />commented on your{post}</>,
    Follow: <><UserPlusIcon  className="-mb-0.5" size={16} />started following you</>,
    Mention: <><AtSignIcon  className="-mb-0.5" size={16} />mentioned you in their{post}</>,
    Repost: <><Repeat2Icon  className="-mb-0.5" size={16} />reposted your{post}</>,
    Action: <><CirclePlusIcon  className="-mb-0.5" size={16} />acted on your{post}</>,
    Quote: <><MessageSquareQuoteIcon  className="-mb-0.5" size={16} />quoted your{post}</>,
  }
  const notificationText = notificationTextMap[notification.type];

  const usersText = notification.who.map((profile, i, arr) => {
    const userName = profile.name || profile.handle;
    const userLink = (
      <Link key={profile.id + i} className="font-bold hover:underline whitespace-nowrap" href={`/u/${profile.handle}`}>
        {userName}
      </Link>
    );

    if (i === 0) return <>{userLink}</>;
    if (i === arr.length - 1) return <> and {userLink}</>;
    return <>, {userLink}</>;
  });

  return (
    <Card>
      <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
        <div className=" shrink-0 grow-0 rounded-full">
          <UserAvatarArray users={notification.who} />
        </div>
        <div className="flex flex-col w-3/4 shrink group max-w-2xl grow gap-1 place-content-center">
          <div className="flex flex-wrap whitespace-pre-wrap">
            {usersText}
            <span className="flex flex-row gap-1 justify-center place-items-center">{notificationText}</span>
          </div>
          <div className="text-muted-foreground text-sm">{notification?.actedOn?.content}</div>
        </div>
      </CardContent>
    </Card>
  );
};
