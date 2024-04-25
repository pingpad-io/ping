import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
import { FeedItemFragment } from "@lens-protocol/client";
import { AnyPublication, FeedItem, Post as LensPost, Profile } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  reply?: Post;
  reactions: Reaction[];
  comments: Post[];
  metadata: any;
};

export type ReactionType = "UPVOTE" | "DOWNVOTE";

export type Reaction = {
  createdAt?: Date;
  type: ReactionType;
  by: User;
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
      return Error(`Unknown post type on ${post}`);
  }

  if (!root.by.metadata || root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }
  const content = root.metadata.content;

  const reactions: Reaction[] =
    post.__typename === "FeedItem"
      ? post.reactions.map((reaction) => ({
          createdAt: reaction.createdAt as unknown as Date,
          type: reaction.reaction,
          by: lensProfileToUser(reaction.by),
        }))
      : [];

  const author = lensProfileToUser(root.by);

  const comments: Post[] =
    post.__typename === "FeedItem"
      ? post.comments.map((comment) => ({
          id: comment.id as string,
          author: lensProfileToUser(comment.by),
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.createdAt), // NOT IMPLEMENTED YET
          content,
          comments: [],
          reactions: [],
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
