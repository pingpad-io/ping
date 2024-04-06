import { FeedItem } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
};

export type Author = {
  id: string;
  name?: string;
  handle: string;
  profilePictureUrl?: string;
};

export function lensFeedItemToPost(item: FeedItem) {
  // metadata: ArticleMetadataV3 | AudioMetadataV3 | CheckingInMetadataV3 | EmbedMetadataV3 | EventMetadataV3 | ImageMetadataV3 |
  // LinkMetadataV3 | LiveStreamMetadataV3 | MintMetadataV3 | SpaceMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3 |
  // ThreeDMetadataV3 | TransactionMetadataV3 | VideoMetadataV3;
  if (item.root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }

  if (item.root.__typename === "Post") {
    return {
      platform: "lens",
      author: {
        id: item.root.by.id as string,
        name: item.root.by.metadata.displayName as string,
        handle: item.root.by.handle.fullHandle,
        // profilePictureUrl: item.root.by.metadata.picture.raw.uri as string,
      },
      metadata: item.root.metadata,
      content: item.root.metadata.content,
      createdAt: item.root.createdAt as unknown as Date,
      id: item.root.id as string,
      // updatedAt: item.root.updatedAt as unknown as Date, NOT IMPLEMENTED YET
    } as Post;
  }
}
