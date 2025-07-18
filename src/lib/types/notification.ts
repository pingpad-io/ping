import type { Post } from "./post";
import type { User } from "./user";

export type NotificationType = "Reaction" | "Comment" | "Follow" | "Repost" | "Action" | "Mention" | "Quote";

export type Notification = {
  __typename: "Notification";
  id: string;
  who: User[];
  actedOn?: Post;
  createdAt: Date;
  type: NotificationType;
  reactionType?: "Upvote" | "Downvote";
};
