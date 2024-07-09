import type {
  ArticleMetadataV3,
  AudioMetadataV3,
  CheckingInMetadataV3,
  EmbedMetadataV3,
  EventMetadataV3,
  ImageMetadataV3,
  LinkMetadataV3,
  LiveStreamMetadataV3,
  MintMetadataV3,
  SpaceMetadataV3,
  StoryMetadataV3,
  TextOnlyMetadataV3,
  ThreeDMetadataV3,
  TransactionMetadataV3,
  VideoMetadataV3,
} from "@lens-protocol/react-web";
import { AudioPlayer } from "../AudioPlayer";
import Markdown from "../Markdown";
import { VideoPlayer } from "../VideoPlayer";
import { Badge } from "../ui/badge";
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
    case "LinkMetadataV3":
      return <LinkView metadata={metadata} />;
    case "LiveStreamMetadataV3":
      return <LiveStreamView metadata={metadata} />;
    case "CheckingInMetadataV3":
      return <CheckingInView metadata={metadata} />;
    case "EmbedMetadataV3":
      return <EmbedView metadata={metadata} />;
    case "EventMetadataV3":
      return <EventView metadata={metadata} />;
    case "MintMetadataV3":
      return <MintView metadata={metadata} />;
    case "SpaceMetadataV3":
      return <SpaceView metadata={metadata} />;
    case "StoryMetadataV3":
      return <StoryView metadata={metadata} />;
    case "TransactionMetadataV3":
      return <TransactionView metadata={metadata} />;
    case "ThreeDMetadataV3":
      return <ThreeDView metadata={metadata} />;
    default:
      return null;
  }
};

const ContentView = ({ content }: { content: string }) => {
  return <Markdown content={content} />;
};

export const TextOnlyView = ({ metadata }: { metadata: TextOnlyMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const ArticleView = ({ metadata }: { metadata: ArticleMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const ImageView = ({ metadata }: { metadata: ImageMetadataV3 }) => {
  const url = metadata.asset.image?.optimized?.uri || metadata.asset.image?.raw.uri;
  const alt = metadata.asset.altTag;
  const title = metadata.title;

  return (
    <div>
      <ContentView content={metadata.content} />
      <div className="relative mt-2 w-full">
        <img src={url} alt={alt || title} className="object-cover border w-full rounded-xl h-auto" />
      </div>
    </div>
  );
};

export const VideoView = ({ metadata }: { metadata: VideoMetadataV3 }) => {
  const url = metadata.asset.video.optimized.uri || metadata.asset.video.raw.uri;
  const cover = metadata.asset.cover?.optimized.uri || metadata.asset.cover?.raw.uri;

  return (
    <div>
      <ContentView content={metadata.content} />
      <VideoPlayer url={url} preview={cover} />
    </div>
  );
};

export const AudioView = ({ metadata }: { metadata: AudioMetadataV3 }) => {
  const url = metadata.asset.audio.optimized.uri || metadata.asset.audio.raw.uri;
  const cover = metadata.asset.cover?.optimized.uri || metadata.asset.cover?.raw.uri;
  const artist = metadata.asset.artist;
  const title = metadata.title;

  return (
    <div>
      <ContentView content={metadata.content} />
      <AudioPlayer url={url} cover={cover} author={artist} title={title} />
    </div>
  );
};

export const LinkView = ({ metadata }: { metadata: LinkMetadataV3 }) => {
  return (
    <div>
      <ContentView content={metadata.content} />
      <Badge className="p-2">{metadata.sharingLink}</Badge>
    </div>
  );
};

export const LiveStreamView = ({ metadata }: { metadata: LiveStreamMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const CheckingInView = ({ metadata }: { metadata: CheckingInMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const EmbedView = ({ metadata }: { metadata: EmbedMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const EventView = ({ metadata }: { metadata: EventMetadataV3 }) => {
  return (
    <div>
      <h1>Event</h1>
      Starts at: <Badge>{metadata.startsAt}</Badge>
      Ends at: {metadata.endsAt}
      Where: {metadata.location}
    </div>
  );
};

export const MintView = ({ metadata }: { metadata: MintMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const SpaceView = ({ metadata }: { metadata: SpaceMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const StoryView = ({ metadata }: { metadata: StoryMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const TransactionView = ({ metadata }: { metadata: TransactionMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};

export const ThreeDView = ({ metadata }: { metadata: ThreeDMetadataV3 }) => {
  return <ContentView content={metadata.content} />;
};
