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
import type { Notification } from "./Notification";

export const NotificationView = ({ notification }: { notification: Notification }) => {
  const post = (
    <Link className="hover:underline" href={`/p/${notification?.actedOn?.id}`}>
      post
    </Link>
  );

  // biome-ignore format: keep it compact
  const notificationTextMap = {
    Reaction: <> liked your{post} <HeartIcon className="-mb-0.5" size={16} /></>,
    Comment: <> commented on your{post} <MessageSquareIcon className="-mb-0.5" size={16} /></>,
    Follow: <> started following you <UserPlusIcon className="-mb-0.5" size={16} /></>,
    Mention: <> mentioned you in their{post} <AtSignIcon className="-mb-0.5" size={16} /></>,
    Repost: <> reposted your{post} <Repeat2Icon className="-mb-0.5" size={16} /></>,
    Action: <> acted on your{post} <CirclePlusIcon className="-mb-0.5" size={16} /></>,
    Quote: <> quoted your{post} <MessageSquareQuoteIcon className="-mb-0.5" size={16} /></>,
  };

  const maxUsersPerNotification = 5;
  const users = notification.who.slice(0, maxUsersPerNotification);
  const wasTruncated = notification.who.length > maxUsersPerNotification;
  const amountTruncated = notification.who.length - maxUsersPerNotification;
  const notificationText = notificationTextMap[notification.type];

  const usersText = users.map((profile, i, arr) => {
    const userName = profile.name || profile.handle;
    const userLink = (
      <Link
        key={profile.id + notification.id + notification.type}
        className="font-bold hover:underline whitespace-nowrap"
        href={`/u/${profile.handle}`}
      >
        {userName}
      </Link>
    );
    const lastText = wasTruncated ? <>{amountTruncated} others</> : <>{userLink}</>;

    if (i === 0) return <span key={`${profile.id + notification.id + notification.type}first`}>{userLink}</span>;
    if (i === arr.length - 1)
      return <span key={`${profile.id + notification.id + notification.type}last`}> and {lastText}</span>;
    return <span key={`${profile.id + notification.id + notification.type}comma`}>, {userLink}</span>;
  });

  return (
    <Card>
      <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
        <div className=" shrink-0 grow-0 rounded-full">
          <UserAvatarArray users={users} amountTruncated={wasTruncated ? amountTruncated : undefined} />
        </div>
        <div className="flex flex-col w-3/4 shrink group max-w-2xl grow gap-1 place-content-center">
          <div className="flex flex-wrap whitespace-pre-wrap">
            {usersText}
            <span className="flex flex-row gap-1 justify-center place-items-center">{notificationText}</span>
          </div>
          <div className="text-muted-foreground text-sm">{notification?.actedOn?.metadata?.content}</div>
        </div>
      </CardContent>
    </Card>
  );
};
