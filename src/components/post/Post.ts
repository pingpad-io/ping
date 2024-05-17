import type { AnyPublicationFragment, FeedItemFragment, PostFragment, QuoteFragment } from "@lens-protocol/client";
import type { AnyPublication, Comment, FeedItem, Post as LensPost, Quote } from "@lens-protocol/react-web";
import { type User, lensProfileToUser } from "../user/User";

export type PostReactionType = "Upvote" | "Downvote" | "Repost" | "Comment" | "Bookmark" | "Collect";
export type PostReactions = Record<PostReactionType, number>;
export type PostPlatform = "lens" | "farcaster";

export type Post = {
  id: string;
  platform: PostPlatform;
  content: string;
  author: User;
  createdAt: Date;
  comments: Post[];
  metadata: any;
  reactions?: Partial<PostReactions>;
  updatedAt?: Date;
  reply?: Post;
};

export function lensItemToPost(
  item: FeedItem | FeedItemFragment | PostFragment | QuoteFragment | AnyPublication | AnyPublicationFragment,
): Post {
  const post: Post = {
    id: "",
    platform: "lens",
    author: null,
    reactions: {},
    reply: null,
    comments: [],
    metadata: null,
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!item) return post;

  const normalizedPost = normalizePost(item);

  let origin: Comment | LensPost | Quote;
  switch (normalizedPost.__typename) {
    case "FeedItem":
      origin = normalizedPost.root;
      break;
    case "Post":
      origin = normalizedPost as LensPost;
      break;
    case "Comment":
      origin = normalizedPost as Comment;
      break;
    case "Quote":
      origin = normalizedPost as Quote;
      break;
    case "Mirror":
      origin = normalizedPost.mirrorOn as LensPost;
      break;
    default:
      return post;
  }

  post.id = origin.id;
  post.author = lensProfileToUser(origin.by);
  post.content = "content" in origin.metadata ? origin?.metadata?.content : "";

  post.reactions = getReactions(origin.stats);
  post.comments = getComments(normalizedPost, post.content);
  post.reply = getReply(origin);
  post.metadata = origin.metadata;
  post.createdAt = new Date(origin.createdAt);
  post.updatedAt = new Date(origin.createdAt);

  return post;
}

function normalizePost(
  item: FeedItem | FeedItemFragment | PostFragment | QuoteFragment | AnyPublication | AnyPublicationFragment,
) {
  if (!("__typename" in item)) {
    return { __typename: "FeedItem", ...(item as any as FeedItem) };
  }
  return item;
}

function getReactions(stats: any) {
  return {
    Upvote: stats?.upvotes,
    Downvote: stats?.downvotes,
    Bookmark: stats?.bookmarks,
    Collect: stats?.collects,
    Comment: stats?.comments,
    Repost: stats?.mirrors,
  };
}

function getComments(post: any, content: string) {
  if (post.__typename === "FeedItem") {
    return post.comments.map((comment) => ({
      id: comment.id as string,
      author: lensProfileToUser(comment.by),
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.createdAt),
      content,
      comments: [],
      reactions: undefined,
      metadata: comment.metadata,
      platform: "lens",
    }));
  }
  return [];
}

function getReply(origin: Comment | Quote | LensPost) {
  const reply = {
    reply: undefined,
    reactions: undefined,
    platform: "lens",
    comments: [],
    metadata: origin.metadata,
    createdAt: new Date(origin.createdAt),
    updatedAt: new Date(origin.createdAt),
  } as Post;

  switch (origin.__typename) {
    case "Comment":
      return {
        id: origin.root.id,
        author: origin?.commentOn?.by ? lensProfileToUser(origin?.commentOn?.by) : undefined,
        content: "content" in origin.commentOn.metadata ? origin.commentOn.metadata.content : "",
        ...reply,
      } as Post;

    case "Quote":
      return {
        id: origin.quoteOn.id,
        author: origin?.quoteOn?.by ? lensProfileToUser(origin?.quoteOn?.by) : undefined,
        content: "content" in origin.quoteOn.metadata ? origin.quoteOn?.metadata?.content : "",
        ...reply,
      } as Post;
    case "Post":
      return;
  }
}
