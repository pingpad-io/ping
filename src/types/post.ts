import { FeedItem, Profile } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: Author;
  createdAt: Date;
  updatedAt?: Date;
  metadata: any;
};

export type Author = {
  id: string;
  name?: string;
  handle: string;
  profilePictureUrl?: string;
};

export function profileToAuthor(profile: Profile): Author {
  return {
    id: profile.id,
    name: profile.metadata.displayName,
    profilePictureUrl:
      profile.metadata.picture.__typename === "ImageSet"
        ? profile.metadata.picture.optimized.uri
        : profile.metadata.picture.image.optimized.uri,
    handle: profile.handle.fullHandle,
  };
}

export function lensFeedItemToPost(item: FeedItem) {
  // metadata: ArticleMetadataV3 | AudioMetadataV3 | CheckingInMetadataV3 | EmbedMetadataV3 | EventMetadataV3 | ImageMetadataV3 |
  // LinkMetadataV3 | LiveStreamMetadataV3 | MintMetadataV3 | SpaceMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3 |
  // ThreeDMetadataV3 | TransactionMetadataV3 | VideoMetadataV3;
  if (!item.root.by.metadata || item.root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }

  const profilePictureUrl =
    item.root.by.metadata.picture.__typename === "ImageSet"
      ? item.root.by.metadata?.picture?.optimized?.uri
      : item.root.by.metadata?.picture?.image.optimized?.uri;

  const handle = (item.root.by.handle?.fullHandle) ?? item.root.by.id;

  if (item.root.__typename === "Post") {
    return {
      platform: "lens",
      author: {
        id: item.root.by.id as string,
        name: item.root.by.metadata.displayName as string,
        handle,
        profilePictureUrl,
      },
      metadata: item.root.metadata,
      content: item.root.metadata.content,
      createdAt: item.root.createdAt as unknown as Date,
      id: item.root.id as string,
      // updatedAt: item.root.updatedAt as unknown as Date, NOT IMPLEMENTED YET
    } as Post;
  }
}
