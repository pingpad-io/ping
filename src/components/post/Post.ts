import type { AnyPost, Post as LensPost, Repost, TimelineItem } from "@lens-protocol/client";
import { type User, lensAcountToUser } from "../user/User";
import { PostMetadata } from "@lens-protocol/metadata";
import { FeedItem } from "@lens-protocol/api-bindings";

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
  metadata: any;
  reactions?: Partial<PostReactions>;
  updatedAt?: Date;
  reply?: Post;
};

export function lensItemToPost(item: AnyPost | TimelineItem): Post | null {
  if (!item) return null;

  if (item.__typename === "Repost") {
    return null;
  }

  if (item.__typename === "TimelineItem") {
    return lensItemToPost(item.primary);
  }

  let post: Post;
  try {
    const author = item.author;
    const timestamp = item.timestamp;

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

function getReactions(post: LensPost): Partial<PostReactions> {
  return {
    Upvote: post.stats?.upvotes || 0,
    Downvote: post.stats?.downvotes || 0,
    Bookmark: post.stats?.bookmarks || 0,
    Collect: post.stats?.collects || 0,
    Comment: post.stats?.comments || 0,
    Repost: post.stats?.reposts || 0,
    isUpvoted: post.operations?.hasUpvoted || false,
    isDownvoted: post.operations?.hasDownvoted || false,
    isBookmarked: post.operations?.hasBookmarked || false,
    isCollected: post.operations?.hasSimpleCollected || false,
    isReposted: post.operations?.hasReposted.optimistic || false,
    canCollect: post.operations?.canSimpleCollect.__typename === "SimpleCollectValidationPassed" || false,
    canComment: post.operations?.canComment.__typename === "PostOperationValidationPassed" || false,
    canRepost: post.operations?.canRepost.__typename === "PostOperationValidationPassed" || false,
    canQuote: post.operations?.canQuote.__typename === "PostOperationValidationPassed" || false,
    canDecrypt: false,
    totalReactions: post.stats?.upvotes + post.stats?.downvotes + post.stats?.bookmarks + post.stats?.collects + post.stats?.comments + post.stats?.reposts || 0,
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
