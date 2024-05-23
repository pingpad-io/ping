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
  const title = metadata.title;

  return (
    <div>
      <Markdown content={metadata.content} />
      <h1>{title}</h1>
      <div className="relative mt-2 w-[90%] aspect-square">
        <Image className="object-cover border w-full h-full rounded-xl" src={url} alt={alt} fill />
      </div>
    </div>
  );
};
