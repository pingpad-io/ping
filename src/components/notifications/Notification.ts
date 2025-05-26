import type { Notification as LensNotification, TippingAccountActionExecuted, UnknownAccountActionExecuted } from "@lens-protocol/client";
import { type Post, lensItemToPost } from "../post/Post";
import { type User, lensAcountToUser } from "../user/User";

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

export function lensNotificationToNative(item: LensNotification): Notification {
  let profiles: any[] = [];
  let actedOn: any;
  let createdAt: string;
  let type: NotificationType;
  let reactionType: "Upvote" | "Downvote";
  let id: string;

  // Handle different notification types in Lens v3
  switch (item.__typename) {
    case "CommentNotification":
      id = item.id;
      profiles = [item.comment.author];
      actedOn = item.comment;
      createdAt = item.comment.timestamp;
      type = "Comment";
      break;
    case "ReactionNotification":
      id = item.id;
      profiles = item.reactions.map((reaction) => reaction.reactions);
      actedOn = item.post || item.post;
      createdAt = item.reactions[0]?.reactions[0].reactedAt || new Date().toISOString();
      type = "Reaction";
      // Handle different reaction formats
      const reactionValue = item.reactions[0]?.reactions[0].reaction;
      reactionType = reactionValue === "UPVOTE" ? "Upvote" : "Downvote";
      break;
    case "FollowNotification":
      id = item.id;
      profiles = item.followers || [item.followers[0]];
      actedOn = undefined;
      createdAt = item.followers[0].followedAt || new Date().toISOString();
      type = "Follow";
      break;
    case "MentionNotification":
      id = item.id;
      profiles = [item.post?.author || item.post?.author];
      actedOn = item.post || item.post;
      createdAt = (item.post || item.post)?.timestamp || new Date().toISOString();
      type = "Mention";
      break;
    case "RepostNotification":
      id = item.id;
      profiles = item.reposts?.map((repost) => repost.account) || 
                [item.reposts[0]?.account || item.reposts[0]?.account];
      actedOn = item.post || item.post;
      createdAt = (item.post || item.post)?.timestamp || new Date().toISOString();
      type = "Repost";
      break;
    case "QuoteNotification":
      id = item.id;
      profiles = [item.quote?.author];
      actedOn = item.quote || item.quote;
      createdAt = item.quote?.timestamp || new Date().toISOString();
      type = "Quote";
      break;
    case "AccountActionExecutedNotification":
      id = item.id;
      switch (item.actions[0].__typename) {
        case "TippingAccountActionExecuted":
          profiles = item.actions?.map((action: TippingAccountActionExecuted) => action.executedBy) || [];
          actedOn = "Tipping"
          createdAt = (item.actions[0].executedAt) || new Date().toISOString();
          type = "Action";
          break;
        case "UnknownAccountActionExecuted":
          profiles = item.actions?.map((action: UnknownAccountActionExecuted) => action.executedBy) || [];
          actedOn = "Unknown";
          createdAt = (item.actions[0].executedAt) || new Date().toISOString();
          type = "Action";
          break;
      }
      break;
    default:
      // Handle unknown notification types
      profiles = [];
      actedOn = undefined;
      createdAt = new Date().toISOString();
      type = "Action";
      break;
  }

  // Filter out any null/undefined profiles
  const validProfiles = profiles.filter(Boolean);
  const who = validProfiles.map(lensAcountToUser);
  const content = actedOn ? lensItemToPost(actedOn) : undefined;

  return {
    id,
    who,
    type,
    actedOn: content,
    reactionType: reactionType,
    createdAt: new Date(createdAt || Date.now()),
    __typename: "Notification",
  };
}
