import type {
  ArticleMetadataV3,
  AudioMetadataV3,
  ImageMetadataV3,
  TextOnlyMetadataV3,
  VideoMetadataV3,
} from "@lens-protocol/react-web";
import Image from "next/image";
import ReactPlayer from "react-player";
import Markdown from "../Markdown";
import { VideoPlayer } from "../VideoPlayer";
import type { AnyLensMetadata } from "./Post";

export const getPostMetadataView = (metadata: AnyLensMetadata) => {
  switch (metadata.__typename) {
    case "TextOnlyMetadataV3":
      return <TextOnlyView metadata={metadata} />;
    case "ArticleMetadataV3":
      return <ArticleView metadata={metadata} />;
    case "ImageMetadataV3":
      return <ImageView metadata={metadata} />;
    case "VideoMetadataV3":
      return <VideoView metadata={metadata} />;
    case "AudioMetadataV3":
      return <AudioView metadata={metadata} />;
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
  const url = metadata.asset.image?.optimized?.uri || metadata.asset.image?.raw.uri;
  const alt = metadata.asset.altTag;
  const title = metadata.title;

  return (
    <div>
      <Markdown content={metadata.content} />
      <div className="relative mt-2 w-full">
        <img src={url} alt={alt} className="object-cover border w-full rounded-xl h-auto" />
      </div>
    </div>
  );
};

export const VideoView = ({ metadata }: { metadata: VideoMetadataV3 }) => {
  const url = metadata.asset.video.optimized.uri || metadata.asset.video.raw.uri;
  const mimeType = metadata.asset.video.optimized.mimeType || metadata.asset.video.raw.mimeType;
  const cover = metadata.asset.cover?.optimized.uri || metadata.asset.cover?.raw.uri;
  const supported = ReactPlayer.canPlay(url);
  if (!supported) {
    console.error(`unsupported video format: ${mimeType} (${url})`);
  }

  return (
    <div>
      <Markdown content={metadata.content} />
      {supported ? (
        <VideoPlayer url={url} preview={cover} />
      ) : (
        <p className="font-bold h-32 rounded-xl border flex items-center justify-center text-center">
          unsupported video format (╥╥﹏╥╥)
        </p>
      )}
    </div>
  );
};

export const AudioView = ({ metadata }: { metadata: AudioMetadataV3 }) => {
  return <Markdown content={metadata.content} />;
};
