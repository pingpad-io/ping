import type { Notification as LensNotification } from "@lens-protocol/client";
import type { Notification } from "~/lib/types/notification";
import type { User } from "~/lib/types/user";
import { lensItemToPost } from "./postConverter";
import { lensAccountToUser } from "./userConverter";

export function lensNotificationToNative(item: LensNotification): Notification {
  const base = { id: (item as any).id || crypto.randomUUID() };

  switch (item.__typename) {
    case "CommentNotification":
      return {
        ...base,
        who: [lensAccountToUser(item.comment.author)],
        actedOn: lensItemToPost(item.comment) || undefined,
        createdAt: new Date(item.comment.timestamp),
        type: "Comment",
        __typename: "Notification",
      };

    case "ReactionNotification": {
      const reaction = item.reactions[0]?.reactions[0];
      return {
        ...base,
        who: item.reactions.map((r) => lensAccountToUser(r.account)),
        actedOn: item.post ? lensItemToPost(item.post) || undefined : undefined,
        createdAt: new Date(reaction?.reactedAt ?? Date.now()),
        type: "Reaction",
        reactionType: reaction?.reaction === "UPVOTE" ? "Upvote" : "Downvote",
        __typename: "Notification",
      };
    }

    case "PostActionExecutedNotification":
      return {
        ...base,
        who: [lensAccountToUser(item.post.author)],
        actedOn: lensItemToPost(item.post) || undefined,
        createdAt: new Date(item.post.timestamp),
        type: "Action",
        __typename: "Notification",
      };

    case "AccountActionExecutedNotification": {
      const action = item.actions[0];
      if (!action) {
        return {
          ...base,
          who: [],
          createdAt: new Date(),
          type: "Action",
          __typename: "Notification",
        };
      }

      let who: User[] = [];
      let createdAt = new Date();

      switch (action.__typename) {
        case "TippingAccountActionExecuted":
          if ((action as any).account) {
            who = [lensAccountToUser((action as any).account)];
          }
          createdAt = new Date((action as any).executedAt || Date.now());
          break;

        case "UnknownAccountActionExecuted":
          if ((action as any).account) {
            who = [lensAccountToUser((action as any).account)];
          }
          createdAt = new Date((action as any).executedAt || Date.now());
          break;

        default:
          if ((action as any).account) {
            who = [lensAccountToUser((action as any).account)];
          }
          if ((action as any).executedAt) {
            createdAt = new Date((action as any).executedAt);
          }
          break;
      }

      return {
        ...base,
        who,
        createdAt,
        type: "Action",
        __typename: "Notification",
      };
    }

    case "FollowNotification":
      return {
        ...base,
        who: item.followers.map((f) => lensAccountToUser(f.account)),
        createdAt: new Date(item.followers[0]?.followedAt ?? Date.now()),
        type: "Follow",
        __typename: "Notification",
      };

    case "MentionNotification":
      return {
        ...base,
        who: [lensAccountToUser(item.post.author)],
        actedOn: item.post ? lensItemToPost(item.post) || undefined : undefined,
        createdAt: new Date(item.post.timestamp),
        type: "Mention",
        __typename: "Notification",
      };

    case "RepostNotification":
      return {
        ...base,
        who: item.reposts.map((r) => lensAccountToUser(r.account)),
        actedOn: item.post ? lensItemToPost(item.post) || undefined : undefined,
        createdAt: new Date(item.post.timestamp),
        type: "Repost",
        __typename: "Notification",
      };

    case "QuoteNotification":
      return {
        ...base,
        who: [lensAccountToUser(item.quote.author)],
        actedOn: item.quote ? lensItemToPost(item.quote) || undefined : undefined,
        createdAt: new Date(item.quote.timestamp),
        type: "Quote",
        __typename: "Notification",
      };

    default:
      console.log("Unknown notification type, falling back to Action:", {
        typename: item.__typename,
        item: item,
      });

      return {
        ...base,
        who: [],
        createdAt: new Date(),
        type: "Action",
        __typename: "Notification",
      };
  }
}
