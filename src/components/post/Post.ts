import type {
  AnyPublicationFragment,
  CommentBaseFragment,
  FeedItemFragment,
  PostFragment,
  QuoteBaseFragment,
  QuoteFragment,
} from "@lens-protocol/client";
import type {
  AnyPublication,
  ArticleMetadataV3,
  AudioMetadataV3,
  CheckingInMetadataV3,
  Comment,
  EmbedMetadataV3,
  EventMetadataV3,
  FeedItem,
  ImageMetadataV3,
  LinkMetadataV3,
  LiveStreamMetadataV3,
  MintMetadataV3,
  Post as LensPost,
  Quote,
  SpaceMetadataV3,
  StoryMetadataV3,
  TextOnlyMetadataV3,
  ThreeDMetadataV3,
  TransactionMetadataV3,
  VideoMetadataV3,
} from "@lens-protocol/react-web";
import { type User, lensProfileToUser } from "../user/User";

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
export type PostPlatform = "lens" | "farcaster";
export type AnyLensItem =
  | FeedItem
  | FeedItemFragment
  | PostFragment
  | QuoteFragment
  | AnyPublication
  | AnyPublicationFragment
  | PostFragment
  | QuoteBaseFragment
  | CommentBaseFragment;

export type AnyLensMetadata =
  | ArticleMetadataV3
  | AudioMetadataV3
  | CheckingInMetadataV3
  | EmbedMetadataV3
  | EventMetadataV3
  | ImageMetadataV3
  | LinkMetadataV3
  | LiveStreamMetadataV3
  | MintMetadataV3
  | SpaceMetadataV3
  | StoryMetadataV3
  | TextOnlyMetadataV3
  | ThreeDMetadataV3
  | TransactionMetadataV3
  | VideoMetadataV3;

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
  metadata: AnyLensMetadata;
  reactions?: Partial<PostReactions>;
  updatedAt?: Date;
  reply?: Post;
};

export function lensItemToPost(item: AnyLensItem): Post | null {
  if (!item) return null;

  const normalizedPost = normalizePost(item);

  let origin: Comment | LensPost | Quote;
  switch (normalizedPost.__typename) {
    case "Post":
      origin = normalizedPost as LensPost;
      break;
    case "Comment":
      origin = normalizedPost as Comment;
      break;
    case "Quote":
      origin = normalizedPost as Quote;
      break;
    case "FeedItem":
      origin = normalizedPost.root;
      break;
    case "Mirror":
      origin = normalizedPost.mirrorOn as LensPost;
      break;
    default:
      return null;
  }

  let post: Post;
  try {
    post = {
      id: origin.id,
      author: lensProfileToUser(origin.by),
      reactions: getReactions(origin),
      comments: getComments(normalizedPost),
      reply: getReply(origin),
      metadata: getMetadata(origin.metadata),
      createdAt: new Date(origin.createdAt),
      updatedAt: new Date(origin.createdAt),
      platform: "lens",
      __typename: "Post",
    };
  } catch (error) {
    console.error(error);
    return null;
  }

  return post;
}

function getMetadata(metadata: AnyLensMetadata): any {
  return metadata;
}

function normalizePost(item: AnyLensItem) {
  if (!("__typename" in item)) {
    return { __typename: "FeedItem", ...(item as any as FeedItem) };
  }
  return item;
}

function getReactions(post: LensPost | Comment | Quote): Partial<PostReactions> {
  return {
    Upvote: post.stats.upvotes,
    Downvote: post.stats?.downvotes,
    Bookmark: post.stats?.bookmarks,
    Collect: post.stats?.collects,
    Comment: post.stats?.comments,
    Repost: post.stats?.mirrors,
    isUpvoted: post.operations.hasUpvoted,
    isDownvoted: post.operations.hasDownvoted,
    isBookmarked: post.operations.hasBookmarked,
    isCollected: post.operations.hasCollected.value,
    isReposted: post.operations.hasMirrored,
    canCollect: post.operations.canCollect === "YES",
    canComment: post.operations.canComment === "YES",
    canRepost: post.operations.canMirror === "YES",
    canQuote: post.operations.canQuote === "YES",
    canDecrypt: post.operations.canDecrypt.result,
    totalReactions:
      post.stats.upvotes +
      post.stats.downvotes +
      post.stats.bookmarks +
      post.stats.collects +
      post.stats.comments +
      post.stats.mirrors,
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
        author: lensProfileToUser(comment.by),
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

function getReply(origin: Comment | Quote | LensPost) {
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
        author: origin?.commentOn?.by ? lensProfileToUser(origin?.commentOn?.by) : undefined,
        content: "content" in origin.commentOn.metadata ? origin.commentOn.metadata.content : "",
        metadata: origin.commentOn.metadata,
        ...reply,
      } as Post;

    case "Quote":
      return {
        id: origin.quoteOn.id,
        author: origin?.quoteOn?.by ? lensProfileToUser(origin?.quoteOn?.by) : undefined,
        content: "content" in origin.quoteOn.metadata ? origin.quoteOn?.metadata?.content : "",
        metadata: origin.quoteOn.metadata,
        ...reply,
      } as Post;
    case "Post":
      return;
  }
}

export type { User };
