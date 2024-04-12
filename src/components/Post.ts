import { FeedItem, Profile } from "@lens-protocol/react-web";

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

export function lensFeedItemToPost(item: FeedItem) {
  // metadata: ArticleMetadataV3 | AudioMetadataV3 | CheckingInMetadataV3 | EmbedMetadataV3 | EventMetadataV3 | ImageMetadataV3 |
  // LinkMetadataV3 | LiveStreamMetadataV3 | MintMetadataV3 | SpaceMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3 |
  // ThreeDMetadataV3 | TransactionMetadataV3 | VideoMetadataV3;
  if (!item.root.by.metadata || item.root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }

  const reactions: Reaction[] = item.reactions.map((reaction) => ({
    createdAt: reaction.createdAt as unknown as Date,
    type: reaction.reaction,
    by: lensProfileToUser(reaction.by),
  }));

  const author = lensProfileToUser(item.root.by);

  const comments: Post[] = item.comments.map((comment) => ({
    id: comment.id as string,
    author: lensProfileToUser(comment.by),
    content: comment.metadata.__typename === "TextOnlyMetadataV3" ? comment.metadata.content : "",
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.createdAt), // NOT IMPLEMENTED YET
    comments: [],
    reactions: [],
    metadata: comment.metadata,
    platform: "lens",
  }));

  const createdAt = new Date(item.root.createdAt);

  if (item.root.__typename === "Post") {
    return {
      id: item.root.id as string,
      platform: "lens",
      author,
      reactions,
      comments,
      metadata: item.root.metadata,
      content: item.root.metadata.content,
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
