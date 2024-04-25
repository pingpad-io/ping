import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
import { FeedItemFragment } from "@lens-protocol/client";
import { AnyPublication, FeedItem, Post as LensPost, Profile } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: User;
  stats?: PostStats;
  createdAt: Date;
  comments: Post[];
  metadata: any;
  updatedAt?: Date;
  reply?: Post;
};

export type ReactionType = "UPVOTE" | "DOWNVOTE";

export type Reaction = {
  createdAt?: Date;
  type: ReactionType;
  by: User;
};

export type PostStats = {
  upvotes: number;
  downvotes: number;
  bookmarks: number;
  collects: number;
  comments: number;
  reposts: number;
};

export type User = {
  id: string;
  name?: string;
  handle: string;
  profilePictureUrl?: string;
};

export function lensItemToPost(item: FeedItem | FeedItemFragment | AnyPublication) {
  const post =
    "__typename" in item
      ? item
      : {
          __typename: "FeedItem",
          ...(item as any as FeedItem),
        };

  let root: CommentFields | LensPost | QuoteFields;
  switch (post.__typename) {
    case "FeedItem":
      root = post.root;
      break;
    case "Post":
      root = post;
      break;
    case "Comment":
      root = post.root;
      break;
    case "Quote":
      root = post.quoteOn;
      break;
    case "Mirror":
      root = post.mirrorOn;
      break;
    default:
      return null;
  }

  if (!root.by.metadata || root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }
  const content = root.metadata.content;

  const author = lensProfileToUser(root.by);
  const stats: PostStats = {
    upvotes: root.stats.upvotes,
    downvotes: root.stats.downvotes,
    comments: root.stats.comments,
    reposts: root.stats.mirrors,
    collects: root.stats.collects,
    bookmarks: root.stats.bookmarks,
  };

  const comments: Post[] =
    post.__typename === "FeedItem"
      ? post.comments.map((comment) => ({
          id: comment.id as string,
          author: lensProfileToUser(comment.by),
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.createdAt), // NOT IMPLEMENTED YET
          content,
          comments: [],
          metadata: comment.metadata,
          platform: "lens",
        }))
      : [];

  const createdAt = new Date(root.createdAt);

  if (root.__typename === "Post") {
    return {
      id: root.id as string,
      platform: "lens",
      author,
      stats,
      comments,
      metadata: root.metadata,
      content: root.metadata.content,
      createdAt,
      updatedAt: createdAt, // NOT IMPLEMENTED YET
    } as Post;
  }
}

export function lensProfileToUser(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.metadata.displayName,
    profilePictureUrl:
      profile.metadata.picture.__typename === "ImageSet"
        ? profile.metadata?.picture?.optimized?.uri
        : profile.metadata?.picture?.image.optimized?.uri,
    handle: profile.handle?.fullHandle ?? profile.handle.id,
  };
}