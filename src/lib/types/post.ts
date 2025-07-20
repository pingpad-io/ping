import type { User } from "./user";

export type PostReactionType = "Repost" | "Comment" | "Bookmark" | "Collect";

export type PostReactions = Record<PostReactionType, number> & {
  totalReactions: number;
  upvotes: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
  isCollected?: boolean;
  isReposted?: boolean;
  canComment: boolean;
  canRepost: boolean;
  canCollect: boolean;
  canQuote: boolean;
  canDecrypt: boolean;
  canEdit: boolean;
};

export type PostPlatform = "lens" | "bsky";

export type PostActions = {
  canComment: boolean;
  canRepost: boolean;
  canCollect: boolean;
};

export type PostMention =
  | {
      __typename: "AccountMention";
      account: string;
      namespace?: string;
      localName?: string;
      replace?: {
        __typename: "MentionReplace";
        from: string;
        to: string;
      };
    }
  | { __typename: "GroupMention"; group: string };

export type Post = {
  __typename: "Post";
  id: string;
  platform: PostPlatform;
  author: User;
  createdAt: Date;
  comments: Post[];
  metadata: any;
  mentions?: PostMention[];
  reactions?: Partial<PostReactions>;
  updatedAt?: Date;
  commentOn?: Post;
  quoteOn?: Post;
  reply?: Post;
  isRepost?: boolean;
  repostedBy?: User;
  repostedAt?: Date;
  isEdited?: boolean;
};
