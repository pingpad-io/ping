import type { AnyPost, PostMetadata } from "@lens-protocol/client";
import { type User, lensAcountToUser } from "../user/User";

export type PostReactionType = "Upvote" | "Downvote" | "Repost" | "Comment" | "Bookmark" | "Collect";
export type PostReactions = Record<PostReactionType, number> & {
  totalReactions: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  isBookmarked?: boolean;
  isCollected?: boolean;
  isReposted?: boolean;
  canComment: boolean;
  canRepost: boolean;
  canCollect: boolean;
  canQuote: boolean;
  canDecrypt: boolean;
};
export type PostPlatform = "lens" | "bsky";
export type PostActions = {
  canComment: boolean;
  canRepost: boolean;
  canCollect: boolean;
};

export type Post = {
  __typename: "Post";
  id: string;
  platform: PostPlatform;
  author: User;
  createdAt: Date;
  comments: Post[];
  metadata: PostMetadata;
  reactions?: Partial<PostReactions>;
  updatedAt?: Date;
  reply?: Post;
};

export function lensItemToPost(item: any): Post | null {
  if (!item) return null;

  // Handle different post types in Lens v3
  if (item.__typename === "Repost" || item.__typename === "Mirror") {
    return null;
  }

  // Handle TimelineItem type from fetchTimeline
  if (item.__typename === "TimelineItem") {
    return lensItemToPost(item.primary);
  }

  let post: Post;
  try {
    const author = item.by || item.author;
    const timestamp = item.createdAt || item.timestamp;
    
    post = {
      id: item.id,
      author: lensAcountToUser(author),
      reactions: getReactions(item),
      comments: getCommentsFromItem(item),
      reply: getReplyFromItem(item),
      metadata: item.metadata,
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
      platform: "lens",
      __typename: "Post",
    };
  } catch (error) {
    console.error(error);
    return null;
  }

  return post;
}

function getReactions(post: any): Partial<PostReactions> {
  return {
    Upvote: 0,
    Downvote: 0,
    Bookmark: 0,
    Collect: 0,
    Comment: 0,
    Repost: 0,
    isUpvoted: false,
    isDownvoted: false,
    isBookmarked: false,
    isCollected: false,
    isReposted: false,
    canCollect: true,
    canComment: true,
    canRepost: true,
    canQuote: false,
    canDecrypt: false,
    totalReactions: 0,
  };
}

function getCommentsFromItem(post: any) {
  let comments = [];
  
  // Handle TimelineItem comments
  if (post.__typename === "TimelineItem" && post.comments) {
    return post.comments.map(processComment);
  }
  
  // Handle FeedItem comments
  if (post.__typename === "FeedItem" && post.comments) {
    return post.comments
      .filter((comment) => comment.commentOn?.id === post.root?.id)
      .map(processComment);
  }
  
  return comments;
}

function processComment(comment: any) {
  return {
    id: comment.id,
    author: comment.by ? lensAcountToUser(comment.by) : null,
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.createdAt),
    comments: [],
    reactions: getReactions(comment),
    metadata: comment.metadata,
    platform: "lens",
    __typename: "Post" as const,
  };
}

function getReplyFromItem(origin: any) {
  if (!origin) return undefined;
  
  // Handle Comment type
  if (origin.__typename === "Comment" && origin.commentOn) {
    return {
      id: origin.commentOn.id,
      author: origin.commentOn.by ? lensAcountToUser(origin.commentOn.by) : undefined,
      content: origin.commentOn.metadata?.content || "",
      metadata: origin.commentOn.metadata,
      createdAt: new Date(origin.commentOn.createdAt || Date.now()),
      updatedAt: new Date(origin.commentOn.createdAt || Date.now()),
      reactions: undefined,
      platform: "lens",
      comments: [],
      __typename: "Post" as const,
    } as Post;
  }
  
  // Handle Quote type
  if (origin.__typename === "Quote" && origin.quoteOn) {
    return {
      id: origin.quoteOn.id,
      author: origin.quoteOn.by ? lensAcountToUser(origin.quoteOn.by) : undefined,
      content: origin.quoteOn.metadata?.content || "",
      metadata: origin.quoteOn.metadata,
      createdAt: new Date(origin.quoteOn.createdAt || Date.now()),
      updatedAt: new Date(origin.quoteOn.createdAt || Date.now()),
      reactions: undefined,
      platform: "lens",
      comments: [],
      __typename: "Post" as const,
    } as Post;
  }
  
  return undefined;
}

export type { User };
