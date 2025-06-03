"use client";

import {
  AtSignIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
  Repeat2Icon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect } from "react";
import Link from "~/components/Link";
import { TruncatedText } from "../TruncatedText";
import { Card, CardContent } from "../ui/card";
import { UserAvatarArray } from "../user/UserAvatar";
import type { Notification } from "./Notification";
import { useNotifications } from "./NotificationsContext";

export const NotificationView = ({ item }: { item: Notification }) => {
  const { markAllAsRead, lastSeen } = useNotifications();

  const notificationTime = new Date(item.createdAt).getTime();
  const highlight = lastSeen !== null && notificationTime > lastSeen;

  useEffect(() => {
    setTimeout(() => {
      if (highlight) {
        markAllAsRead();
        console.log("Marked all as read");
      }
    }, 300);
  }, [highlight]);

  const post = (
    <Link className="hover:underline" href={`/p/${item?.actedOn?.id}`}>
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
  const uniqueUsers = item.who.filter((user, index, arr) => arr.findIndex((u) => u.id === user.id) === index);
  const users = uniqueUsers.slice(0, maxUsersPerNotification);
  const wasTruncated = uniqueUsers.length > maxUsersPerNotification;
  const amountTruncated = uniqueUsers.length - maxUsersPerNotification;
  const notificationText = notificationTextMap[item.type];

  const usersText = users.map((profile, i, arr) => {
    const userName = profile.name || profile.handle;
    const userLink = (
      <Link
        key={profile.id + item.id + notificationTime}
        className="font-bold hover:underline whitespace-nowrap"
        href={`/u/${profile.handle}`}
      >
        {userName}
      </Link>
    );
    const lastText = wasTruncated ? <>{amountTruncated} others</> : <>{userLink}</>;

    if (i === 0) return <span key={`${profile.id + item.id + item.type}first`}>{userLink}</span>;
    if (i === arr.length - 1) return <span key={`${profile.id + item.id + item.type}last`}> and {lastText}</span>;
    return <span key={`${profile.id + item.id + item.type}comma`}>, {userLink}</span>;
  });

  const metadata = item?.actedOn?.metadata as any;
  const content = metadata && "content" in metadata ? (metadata.content as string) : "";
  let image: string | undefined;
  if (metadata) {
    if ("image" in metadata && metadata.image) {
      image = (metadata.image as any).item as string;
    } else if ("attachments" in metadata && Array.isArray(metadata.attachments) && metadata.attachments[0]) {
      image = (metadata.attachments[0] as any).item as string;
    }
  }

  return (
    <Card className={highlight ? "bg-accent/20" : "bg-transparent backdrop-blur-3xl backdrop-opacity-80"}>
      <CardContent className="flex h-fit w-full flex-row gap-4 p-2 sm:p-4">
        <div className="shrink-0 grow-0 rounded-full">
          <UserAvatarArray users={users} amountTruncated={wasTruncated ? amountTruncated : undefined} />
        </div>
        <div className="flex flex-col shrink group max-w-md grow gap-1 place-content-center">
          <div className="flex flex-wrap whitespace-pre-wrap truncate text-ellipsis overflow-hidden">
            {usersText}
            <span className="flex flex-row gap-1 justify-center place-items-center">{notificationText}</span>
          </div>
          <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm line-clamp-1 text-ellipsis overflow-hidden">
            {image && <img src={image} alt="" className="w-6 h-6 object-cover rounded" />}
            {content && <TruncatedText text={content} maxLength={150} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
