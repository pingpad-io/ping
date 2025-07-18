"use client";

import {
  AtSignIcon,
  CirclePlusIcon,
  ExternalLinkIcon,
  HeartIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
  Repeat2Icon,
  ShieldIcon,
  ShieldOffIcon,
  UserPlusIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "~/components/Link";
import { useUserActions } from "~/hooks/useUserActions";
import type { Notification } from "~/lib/types/notification";
import { useFilteredUsers } from "../FilteredUsersContext";
import { TruncatedText } from "../TruncatedText";
import { Card, CardContent } from "../ui/card";
import { ContextMenu as Context, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { UserAvatarArray } from "../user/UserAvatar";
import { useUser } from "../user/UserContext";
import { useNotifications } from "./NotificationsContext";

export const NotificationView = ({ item }: { item: Notification }) => {
  const { markAllAsRead, lastSeen } = useNotifications();
  const { mutedUsers, blockedUsers } = useFilteredUsers();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isDissolving, setIsDissolving] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  // Get the primary user (first in the list) for context menu actions
  const primaryUser = item.who[0];
  const { muteUser, unmuteUser, blockUser, unblockUser } = useUserActions(primaryUser || undefined);

  const notificationTime = new Date(item.createdAt).getTime();
  const highlight = lastSeen !== null && notificationTime > lastSeen;

  const hasMutedUser = item.who.some((user) => user.actions?.muted || mutedUsers.has(user.id));
  const hasBlockedUser = item.who.some((user) => user.actions?.blocked || blockedUsers.has(user.id));
  const isJustMuted = item.who.some((user) => mutedUsers.has(user.id));
  const isJustBlocked = item.who.some((user) => blockedUsers.has(user.id));

  const isOnUserProfile = item.who.some((user) => pathname?.startsWith(`/u/${user.handle}`));

  useEffect(() => {
    setTimeout(() => {
      if (highlight) {
        markAllAsRead();
        console.log("Marked all as read");
      }
    }, 300);
  }, [highlight]);

  useEffect(() => {
    if ((isJustMuted || isJustBlocked) && !isOnUserProfile) {
      setIsDissolving(true);
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isJustMuted, isJustBlocked, isOnUserProfile]);

  if (((hasMutedUser || hasBlockedUser) && !isOnUserProfile) || shouldHide) {
    return null;
  }

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
    const lastText = wasTruncated ? <>{amountTruncated} others</> : userLink;

    if (i === 0) return <span key={`${profile.id + item.id + item.type}first`}>{userLink}</span>;
    if (i === arr.length - 1) return <span key={`${profile.id + item.id + item.type}last`}> and {lastText}</span>;
    return <span key={`${profile.id + item.id + item.type}comma`}>, {userLink}</span>;
  });

  // For Comment notifications, we need to handle original post vs comment content
  let originalPostContent = "";
  let originalPostImage: string | undefined;
  let replyContent = "";
  let replyImage: string | undefined;

  if (item.type === "Comment" && item.actedOn) {
    // The comment itself (actedOn)
    const commentMetadata = item.actedOn.metadata as any;
    replyContent = commentMetadata && "content" in commentMetadata ? (commentMetadata.content as string) : "";

    if (commentMetadata) {
      if ("image" in commentMetadata && commentMetadata.image) {
        replyImage = (commentMetadata.image as any).item as string;
      } else if (
        "attachments" in commentMetadata &&
        Array.isArray(commentMetadata.attachments) &&
        commentMetadata.attachments[0]
      ) {
        replyImage = (commentMetadata.attachments[0] as any).item as string;
      }
    }

    // The original post that was commented on
    const originalPost = item.actedOn.commentOn || item.actedOn.reply;
    if (originalPost) {
      const originalMetadata = originalPost.metadata as any;
      originalPostContent =
        originalMetadata && "content" in originalMetadata ? (originalMetadata.content as string) : "";

      if (originalMetadata) {
        if ("image" in originalMetadata && originalMetadata.image) {
          originalPostImage = (originalMetadata.image as any).item as string;
        } else if (
          "attachments" in originalMetadata &&
          Array.isArray(originalMetadata.attachments) &&
          originalMetadata.attachments[0]
        ) {
          originalPostImage = (originalMetadata.attachments[0] as any).item as string;
        }
      }
    }
  } else {
    // For non-comment notifications, use existing logic
    const metadata = item?.actedOn?.metadata as any;
    originalPostContent = metadata && "content" in metadata ? (metadata.content as string) : "";
    if (metadata) {
      if ("image" in metadata && metadata.image) {
        originalPostImage = (metadata.image as any).item as string;
      } else if ("attachments" in metadata && Array.isArray(metadata.attachments) && metadata.attachments[0]) {
        originalPostImage = (metadata.attachments[0] as any).item as string;
      }
    }
  }

  return (
    <>
      {isDissolving && (
        <svg className="absolute" width="0" height="0">
          <defs>
            <filter id={`dissolve-${item.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="turbulence" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="20"
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feGaussianBlur stdDeviation="5" />
              <animate attributeName="stdDeviation" values="0;10" dur="1s" fill="freeze" />
            </filter>
          </defs>
        </svg>
      )}
      <Context>
        <ContextMenuContent
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col w-max gap-1 p-1 rounded-lg border"
        >
          {primaryUser && (
            <>
              <ContextMenuItem
                onClick={() => {
                  router.push(`/u/${primaryUser.handle}`);
                }}
              >
                <ExternalLinkIcon size={12} className="mr-2 h-4 w-4" />
                view profile
              </ContextMenuItem>

              {user?.id !== primaryUser.id && (
                <>
                  <ContextMenuItem
                    onClick={() => {
                      if (primaryUser.actions?.muted) {
                        unmuteUser();
                      } else {
                        muteUser();
                      }
                    }}
                  >
                    {primaryUser.actions?.muted ? (
                      <Volume2Icon size={12} className="mr-2 h-4 w-4" />
                    ) : (
                      <VolumeXIcon size={12} className="mr-2 h-4 w-4" />
                    )}
                    {primaryUser.actions?.muted ? "unmute user" : "mute user"}
                  </ContextMenuItem>

                  <ContextMenuItem
                    onClick={() => {
                      if (primaryUser.actions?.blocked) {
                        unblockUser();
                      } else {
                        blockUser();
                      }
                    }}
                  >
                    {primaryUser.actions?.blocked ? (
                      <ShieldOffIcon size={12} className="mr-2 h-4 w-4" />
                    ) : (
                      <ShieldIcon size={12} className="mr-2 h-4 w-4" />
                    )}
                    {primaryUser.actions?.blocked ? "unblock user" : "block user"}
                  </ContextMenuItem>
                </>
              )}

              {item.who.length > 1 && (
                <ContextMenuItem
                  onClick={() => {
                    toast.info(`This notification involves ${item.who.length} users`);
                  }}
                  disabled
                  className="text-muted-foreground text-xs"
                >
                  +{item.who.length - 1} more {item.who.length - 1 === 1 ? "user" : "users"}
                </ContextMenuItem>
              )}
            </>
          )}
        </ContextMenuContent>
        <ContextMenuTrigger asChild>
          <Card
            className={highlight ? "bg-accent/20" : "bg-transparent backdrop-blur-3xl backdrop-opacity-80"}
            style={{
              filter: isDissolving ? `url(#dissolve-${item.id})` : undefined,
              opacity: isDissolving ? 0 : 1,
              transition: "opacity 1s ease-out",
            }}
          >
            <CardContent className="flex h-fit w-full flex-row gap-4 p-2 sm:p-4">
              <div className="shrink-0 grow-0 rounded-full">
                <UserAvatarArray users={users} amountTruncated={wasTruncated ? amountTruncated : undefined} />
              </div>
              <div className="flex flex-col shrink group max-w-md grow gap-1 place-content-center">
                <div className="flex flex-wrap whitespace-pre-wrap truncate text-ellipsis overflow-hidden">
                  {usersText}
                  <span className="flex flex-row gap-1 justify-center place-items-center">{notificationText}</span>
                </div>

                {(originalPostContent || originalPostImage) && (
                  <Link
                    href={`/p/${
                      item.type === "Comment" && (item.actedOn?.commentOn || item.actedOn?.reply)
                        ? item.actedOn.commentOn?.id || item.actedOn.reply?.id
                        : item?.actedOn?.id
                    }`}
                    className="block rounded p-1 -m-1"
                  >
                    <div className="flex flex-row items-center gap-2 text-muted-foreground/60 text-sm line-clamp-1 text-ellipsis overflow-hidden">
                      {originalPostImage && (
                        <img
                          src={originalPostImage}
                          alt=""
                          className="w-6 h-6 object-cover rounded opacity-60 grayscale"
                        />
                      )}
                      {originalPostContent && (
                        <TruncatedText text={originalPostContent} maxLength={150} className="text-muted-foreground" />
                      )}
                    </div>
                  </Link>
                )}

                {item.type === "Comment" && (replyContent || replyImage) && (
                  <Link href={`/p/${item.actedOn?.id}`} className="block rounded p-1 -m-1">
                    <div className="flex flex-row items-center gap-2 text-foreground text-sm line-clamp-2 text-ellipsis overflow-hidden">
                      {replyImage && <img src={replyImage} alt="" className="w-6 h-6 object-cover rounded" />}
                      {replyContent && (
                        <TruncatedText text={replyContent} maxLength={200} className="text-foreground" />
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
      </Context>
    </>
  );
};
