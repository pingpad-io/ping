import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
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

export function lensItemToPost(publication: FeedItem | AnyPublication) {
  // metadata: ArticleMetadataV3 | AudioMetadataV3 | CheckingInMetadataV3 | EmbedMetadataV3 | EventMetadataV3 | ImageMetadataV3 |
  // LinkMetadataV3 | LiveStreamMetadataV3 | MintMetadataV3 | SpaceMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3 |
  // ThreeDMetadataV3 | TransactionMetadataV3 | VideoMetadataV3;

  let root: CommentFields | LensPost | QuoteFields;
  switch (publication.__typename) {
    case "FeedItem":
      root = publication.root;
      break;
    case "Post":
      root = publication;
      break;
    case "Comment":
      root = publication.root;
      break;
    case "Quote":
      root = publication.quoteOn;
      break;
    case "Mirror":
      root = publication.mirrorOn;
      break;
    default:
      return null;
  }
  if (!root.by.metadata || root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }
  const content = root.metadata.content;

  const reactions: Reaction[] =
    publication.__typename === "FeedItem"
      ? publication.reactions.map((reaction) => ({
          createdAt: reaction.createdAt as unknown as Date,
          type: reaction.reaction,
          by: lensProfileToUser(reaction.by),
        }))
      : [];

  const author = lensProfileToUser(root.by);

  const comments: Post[] =
    publication.__typename === "FeedItem"
      ? publication.comments.map((comment) => ({
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
