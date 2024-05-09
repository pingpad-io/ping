import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
import { AnyPublicationFragment, FeedItemFragment, PostFragment, QuoteFragment } from "@lens-protocol/client";
import { AnyPublication, FeedItem, Post as LensPost } from "@lens-protocol/react-web";
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
  reactions?: PostReactions;
  updatedAt?: Date;
  reply?: Post;
};

export function lensItemToPost(
  item: FeedItem | FeedItemFragment | PostFragment | QuoteFragment | AnyPublication | AnyPublicationFragment,
): Post | null {
  if (!item) {
    return null;
  }

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
      root = post as unknown as LensPost;
      break;
    case "Comment":
      root = post as unknown as CommentFields;
      break;
    case "Quote":
      root = post.quoteOn as unknown as LensPost;
      break;
    case "Mirror":
      // root = post.mirrorOn;
      return null;
    default:
      return null;
  }

  if (!root?.metadata?.__typename || root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }
  const content = root.metadata.content;

  const author = lensProfileToUser(root.by);
  const reactions: PostReactions = {
    Upvote: root.stats?.upvotes,
    Downvote: root.stats?.downvotes,
    Bookmark: root.stats?.bookmarks,
    Collect: root.stats?.collects,
    Comment: root.stats?.comments,
    Repost: root.stats?.mirrors,
  };

  const comments: Post[] =
    post.__typename === "FeedItem"
      ? post.comments.map((comment) => ({
          id: comment.id as string,
          author: lensProfileToUser(comment.by),
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.createdAt),
          content,
          comments: [],
          reactions: undefined,
          metadata: comment.metadata,
          platform: "lens",
        }))
      : [];

  const createdAt = new Date(root.createdAt);
  const reply =
    root.__typename === "Comment"
      ? {
          id: root.id as string,
          author: root?.root?.by ? lensProfileToUser(root?.root?.by) : undefined,
          content: root?.root?.metadata?.__typename !== "EventMetadataV3" ? root?.root?.metadata?.content : "post",
        }
      : undefined;

  return {
    id: root.id as string,
    platform: "lens",
    author,
    reactions,
    reply,
    comments,
    metadata: root.metadata,
    content: root.metadata.content,
    createdAt,
    updatedAt: createdAt,
  } as Post;
}
