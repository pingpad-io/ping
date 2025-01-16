import type { AnyPost, PostMetadata } from "@lens-protocol/client";
import type { Comment, Post as LensPost, Quote } from "@lens-protocol/react-web";
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

export function lensItemToPost(item: AnyPost): Post | null {
  if (!item) return null;

  if (item.__typename === "Repost") {
    return null;
  }

  let post: Post;
  try {
    post = {
      id: item.id,
      author: lensAcountToUser(item.author),
      reactions: getReactions(item),
      comments: getComments(item),
      reply: getReply(item),
      metadata: item.metadata,
      createdAt: new Date(item.timestamp),
      updatedAt: new Date(item.timestamp),
      platform: "lens",
      __typename: "Post",
    };
  } catch (error) {
    console.error(error);
    return null;
  }

  return post;
}

function getReactions(post: AnyPost): Partial<PostReactions> {
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

function getComments(post: AnyLensItem) {
  let comments = [];
  if (!("__typename" in post)) return comments;

  if (post.__typename === "FeedItem") {
    comments = post.comments
      .filter((comment) => comment.commentOn.id === post.root.id) // only render direct comments in feed
      .map((comment: Comment | Quote | LensPost) => ({
        id: comment.id as string,
        author: lensAcountToUser(comment.by),
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.createdAt),
        comments: [],
        reactions: getReactions(comment),
        metadata: comment.metadata,
        platform: "lens",
      }));
  }

  comments.sort((a, b) => b.reactions.totalReactions - a.reactions.totalReactions);
  comments.slice(0, 3);

  return comments;
}

function getReply(origin: AnyPost) {
  const reply = {
    reply: undefined,
    reactions: undefined,
    platform: "lens",
    comments: [],
    createdAt: new Date(origin.createdAt),
    updatedAt: new Date(origin.createdAt),
  } as Post;

  switch (origin.__typename) {
    case "Comment":
      return {
        id: origin.root.id,
        author: origin?.commentOn?.by ? lensAcountToUser(origin?.commentOn?.by) : undefined,
        content: "content" in origin.commentOn.metadata ? origin.commentOn.metadata.content : "",
        metadata: origin.commentOn.metadata,
        ...reply,
      } as Post;

    case "Quote":
      return {
        id: origin.quoteOn.id,
        author: origin?.quoteOn?.by ? lensAcountToUser(origin?.quoteOn?.by) : undefined,
        content: "content" in origin.quoteOn.metadata ? origin.quoteOn?.metadata?.content : "",
        metadata: origin.quoteOn.metadata,
        ...reply,
      } as Post;
    case "Post":
      return;
  }
}

export type { User };
