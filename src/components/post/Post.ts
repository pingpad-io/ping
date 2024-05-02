import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
import { AnyPublicationFragment, FeedItemFragment, PostFragment, QuoteFragment } from "@lens-protocol/client";
import { AnyPublication, FeedItem, Post as LensPost, Profile } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: User;
  createdAt: Date;
  comments: Post[];
  metadata: any;
  reactions?: PostReactions;
  updatedAt?: Date;
  reply?: Post;
};

export type PostReactionType = "Upvote" | "Downvote" | "Repost" | "Comment" | "Bookmark" | "Collect";
export type PostReactions = Record<PostReactionType, number>;

export type User = {
  id: string;
  name?: string;
  handle: string;
  address: string;
  namespace: string;
  profilePictureUrl?: string;
};

export function lensItemToPost(
  item: FeedItem | FeedItemFragment | PostFragment | QuoteFragment | AnyPublication | AnyPublicationFragment,
) {
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
      root = post.root as unknown as CommentFields;
      break;
    case "Quote":
      root = post.quoteOn as unknown as LensPost;
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
  const reactions: PostReactions = {
    Upvote: root.stats.upvotes,
    Downvote: root.stats.downvotes,
    Bookmark: root.stats.bookmarks,
    Collect: root.stats.collects,
    Comment: root.stats.comments,
    Repost: root.stats.mirrors,
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
          reactions: undefined,
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
      reactions,
      comments,
      metadata: root.metadata,
      content: root.metadata.content,
      createdAt,
      updatedAt: createdAt, // NOT IMPLEMENTED YET
    } as Post;
  }
}

export function lensProfileToUser(profile: Profile): User {
  const imageUrl =
    profile.metadata.picture.__typename === "ImageSet"
      ? profile.metadata?.picture?.optimized?.uri || profile.metadata?.picture?.raw?.uri
      : profile.metadata.picture.image.optimized?.uri || profile.metadata.picture.image.raw?.uri;

  return {
    id: profile.id,
    address: profile.ownedBy.address,
    name: profile.metadata.displayName,
    profilePictureUrl: imageUrl,
    handle: profile.handle?.localName ?? profile.id,
    namespace: profile.handle?.namespace ?? "wallet",
  };
}
