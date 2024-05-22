import type { ArticleMetadataV3, ImageMetadataV3, TextOnlyMetadataV3 } from "@lens-protocol/react-web";
import Image from "next/image";
import Markdown from "../Markdown";
import type { AnyLensMetadata } from "./Post";

export const getPostMetadataView = (metadata: AnyLensMetadata) => {
  switch (metadata.__typename) {
    case "TextOnlyMetadataV3":
      return <TextOnlyView metadata={metadata} />;
    case "ArticleMetadataV3":
      return <ArticleView metadata={metadata} />;
    case "ImageMetadataV3":
      return <ImageView metadata={metadata} />;
    default:
      return null;
  }
};

export const TextOnlyView = ({ metadata }: { metadata: TextOnlyMetadataV3 }) => {
  return <Markdown content={metadata.content} />;
};

export const ArticleView = ({ metadata }: { metadata: ArticleMetadataV3 }) => {
  return <Markdown content={metadata.content} />;
};

export const ImageView = ({ metadata }: { metadata: ImageMetadataV3 }) => {
  const url = metadata.asset.image?.optimized.uri || metadata.asset.image?.raw.uri;
  const alt = metadata.asset.altTag;
  // const width = metadata.asset.image?.optimized.width || metadata.asset.image?.raw.width;
  // const height = metadata.asset.image?.optimized.height || metadata.asset.image?.raw.height;

  return (
    <div className="relative w-full aspect-square p-4">
      <div className="p-2 w-full h-full relative">
        <Image className="object-cover w-full h-full border rounded-xl" src={url} alt={alt} fill />
      </div>
    </div>
  );
};
