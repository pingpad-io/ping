import type { Notification as LensNotification } from "@lens-protocol/client";
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

export function lensNotificationToNative(item: any): Notification {
  let profiles: any[] = [];
  let actedOn: any;
  let createdAt: string;
  let type: NotificationType;
  let reactionType: "Upvote" | "Downvote";

  // Handle different notification types in Lens v3
  switch (item.__typename) {
    case "CommentNotification":
      profiles = [item.comment.by];
      actedOn = item.comment;
      createdAt = item.comment.createdAt;
      type = "Comment";
      break;
    case "ReactionNotification":
      profiles = item.reactions.map((reaction) => reaction.by || reaction.profile);
      actedOn = item.post || item.publication;
      createdAt = item.reactions[0]?.reactedAt || item.reactions[0]?.reactions?.[0]?.reactedAt || new Date().toISOString();
      type = "Reaction";
      // Handle different reaction formats
      const reactionValue = item.reactions[0]?.reaction || item.reactions[0]?.reactions?.[0]?.reaction;
      reactionType = reactionValue === "UPVOTE" ? "Upvote" : "Downvote";
      break;
    case "FollowNotification":
      profiles = item.followers || [item.follower];
      actedOn = undefined;
      createdAt = item.createdAt || new Date().toISOString();
      type = "Follow";
      break;
    case "MentionNotification":
      profiles = [item.post?.by || item.publication?.by];
      actedOn = item.post || item.publication;
      createdAt = (item.post || item.publication)?.createdAt || new Date().toISOString();
      type = "Mention";
      break;
    case "MirrorNotification":
    case "RepostNotification":
      profiles = item.mirrors?.map((mirror) => mirror.profile || mirror.by) || 
                [item.mirror?.by || item.repost?.by];
      actedOn = item.post || item.publication;
      createdAt = (item.post || item.publication)?.createdAt || new Date().toISOString();
      type = "Repost";
      break;
    case "QuoteNotification":
      profiles = [item.quote?.by];
      actedOn = item.quote?.quoteOn || item.quote;
      createdAt = item.quote?.createdAt || new Date().toISOString();
      type = "Quote";
      break;
    case "ActedNotification":
      profiles = item.actions?.map((action) => action.by) || [];
      actedOn = item.post || item.publication;
      createdAt = (item.post || item.publication)?.createdAt || new Date().toISOString();
      type = "Action";
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
  const id = item.id;

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
