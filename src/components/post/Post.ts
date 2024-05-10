import { AnyPublicationFragment, FeedItemFragment, PostFragment, QuoteFragment } from "@lens-protocol/client";
import { AnyPublication, Comment, FeedItem, Post as LensPost, Quote } from "@lens-protocol/react-web";
import { User, lensProfileToUser } from "../user/User";

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

  let root: Comment | LensPost | Quote;
  switch (normalizedPost.__typename) {
    case "FeedItem":
      root = normalizedPost.root;
      break;
    case "Post":
      root = normalizedPost as LensPost;
      break;
    case "Comment":
      root = normalizedPost as Comment;
      break;
    case "Quote":
      root = normalizedPost.quoteOn as Quote;
      break;
    case "Mirror":
      return post;
    default:
      return post;
  }

  post.id = root.id as string;
  post.author = lensProfileToUser(root.by);
  post.content = "content" in root.metadata ? root?.metadata?.content : "";

  post.reactions = getReactions(root.stats);
  post.comments = getComments(normalizedPost, post.content);
  post.reply = getReply(root);
  post.metadata = root.metadata;
  post.createdAt = new Date(root.createdAt);
  post.updatedAt = new Date(root.createdAt);

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

function getReply(root: Comment | LensPost | Quote) {
  const reply = {
    reply: undefined,
    reactions: undefined,
    platform: "lens",
    comments: [],
    metadata: root.metadata,
    createdAt: new Date(root.createdAt),
    updatedAt: new Date(root.createdAt),
  } as Post;

  switch (root.__typename) {
    case "Comment":
      return {
        id: root.root.id,
        author: root?.root?.by ? lensProfileToUser(root?.root?.by) : undefined,
        content: "content" in root.root.metadata ? root.root.metadata?.content : "",
        ...reply,
      };
    case "Quote":
      return {
        id: root.quoteOn.id,
        author: root?.quoteOn?.by ? lensProfileToUser(root?.quoteOn?.by) : undefined,
        content: "content" in root.quoteOn.metadata ? root.quoteOn.metadata?.content : "",
        ...reply,
      };
    case "Post":
      return null;
  }
}
