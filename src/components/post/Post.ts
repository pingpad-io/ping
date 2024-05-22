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
  Post as LensPost,
  LinkMetadataV3,
  LiveStreamMetadataV3,
  MintMetadataV3,
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
export type PostReactions = Record<PostReactionType, number>;
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

export function lensItemToPost(item: AnyLensItem): Post {
  const post: Post = {
    id: "",
    author: null,
    reactions: {},
    reply: null,
    comments: [],
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    platform: "lens",
    __typename: "Post",
  };

  if (!item) return post;

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
      return post;
  }

  post.id = origin.id;
  post.author = lensProfileToUser(origin.by);
  post.reactions = getReactions(origin.stats);
  post.comments = getComments(normalizedPost);
  post.reply = getReply(origin);
  post.metadata = getMetadata(origin.metadata);
  post.createdAt = new Date(origin.createdAt);
  post.updatedAt = new Date(origin.createdAt);

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

function getComments(post: any) {
  if (post.__typename === "FeedItem") {
    return post.comments.map((comment) => ({
      id: comment.id as string,
      author: lensProfileToUser(comment.by),
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.createdAt),
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

export type { User };
