import type { NotificationFragment, ProfileFragment } from "@lens-protocol/client";
import { type AnyLensItem, type Post, lensItemToPost } from "../post/Post";
import { type User, lensProfileToUser } from "../user/User";

type NotificationType = "Reaction" | "Comment" | "Follow" | "Repost" | "Action" | "Mention" | "Quote";

export type Notification = {
  __typename: "Notification";
  id: string;
  who: User[];
  actedOn?: Post;
  createdAt: Date;
  type: NotificationType;
  reactionType?: "Upvote" | "Downvote";
};

export function lensNotificationToNative(item: NotificationFragment): Notification {
  let profiles: ProfileFragment[] = [];
  let actedOn: AnyLensItem;
  let createdAt: string;
  let type: NotificationType;
  let reactionType: "Upvote" | "Downvote";

  switch (item.__typename) {
    case "CommentNotification":
      profiles = [item.comment.by];
      actedOn = item.comment;
      createdAt = item.comment.createdAt;
      type = "Comment";
      break;
    case "ActedNotification":
      profiles = item.actions.map((action) => action.by);
      actedOn = item.publication;
      createdAt = item.publication.createdAt;
      type = "Action";
      break;
    case "FollowNotification":
      profiles = item.followers;
      actedOn = undefined;
      createdAt = undefined;
      type = "Follow";
      break;
    case "MentionNotification":
      profiles = [item.publication.by];
      actedOn = item.publication;
      createdAt = item.publication.createdAt;
      type = "Mention";
      break;
    case "MirrorNotification":
      profiles = item.mirrors.map((mirror) => mirror.profile);
      actedOn = item.publication;
      createdAt = item.publication.createdAt;
      type = "Repost";
      break;
    case "QuoteNotification":
      profiles = [item.quote.by];
      actedOn = item.quote.quoteOn;
      createdAt = item.quote.createdAt;
      type = "Quote";
      break;
    case "ReactionNotification":
      profiles = item.reactions.map((reaction) => reaction.profile);
      actedOn = item.publication;
      createdAt = item.reactions[0].reactions[0].reactedAt;
      type = "Reaction";
      reactionType = item.reactions[0].reactions[0].reaction === "UPVOTE" ? "Upvote" : "Downvote";
      break;
  }

  const who = profiles.map(lensProfileToUser);
  const content = actedOn ? lensItemToPost(actedOn) : undefined;
  const id = item.id;

  return {
    id,
    who,
    type,
    actedOn: content,
    reactionType: reactionType,
    createdAt: new Date(createdAt),
    __typename: "Notification",
  };
}
