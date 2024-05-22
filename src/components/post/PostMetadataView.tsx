import type { TextOnlyMetadataV3 } from "@lens-protocol/react-web";
import Markdown from "../Markdown";
// export type AnyLensMetadata =
//   | ArticleMetadataV3
//   | AudioMetadataV3
//   | CheckingInMetadataV3
//   | EmbedMetadataV3
//   | EventMetadataV3
//   | ImageMetadataV3
//   | LinkMetadataV3
//   | LiveStreamMetadataV3
//   | MintMetadataV3
//   | SpaceMetadataV3
//   | StoryMetadataV3
//   | TextOnlyMetadataV3
//   | ThreeDMetadataV3
//   | TransactionMetadataV3
//   | VideoMetadataV3;

export const TextOnlyView = ({ metadata }: { metadata: TextOnlyMetadataV3 }) => {
  return <Markdown content={metadata.content} />;
};
