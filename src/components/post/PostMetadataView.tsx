import {
  ArticleMetadataDetails,
  AudioMetadataDetails,
  CheckingInMetadataDetails,
  EmbedMetadataDetails,
  EventMetadataDetails,
  ImageMetadataDetails,
  LinkMetadataDetails,
  LiveStreamMetadataDetails,
  MintMetadataDetails,
  SpaceMetadataDetails,
  StoryMetadataDetails,
  TextOnlyMetadataDetails,
  ThreeDMetadataDetails,
  TransactionMetadataDetails,
  VideoMetadataDetails,
} from "@lens-protocol/metadata";
import { AudioPlayer } from "../AudioPlayer";
import { ImageViewer } from "../ImageViewer";
import Markdown from "../Markdown";
import { Badge } from "../ui/badge";
import { VideoPlayer } from "../VideoPlayer";

import type { PostMention } from "./Post";

export const getPostMetadataView = (metadata: any, mentions?: PostMention[]) => {
  switch (metadata.__typename) {
    case "TextOnlyMetadata":
      return <TextOnlyView metadata={metadata as TextOnlyMetadataDetails} mentions={mentions} />;
    case "ArticleMetadata":
      return <ArticleView metadata={metadata as ArticleMetadataDetails} mentions={mentions} />;
    case "ImageMetadata":
      return <ImageView metadata={metadata as ImageMetadataDetails} mentions={mentions} />;
    case "VideoMetadata":
      return <VideoView metadata={metadata as VideoMetadataDetails} mentions={mentions} />;
    case "AudioMetadata":
      return <AudioView metadata={metadata as AudioMetadataDetails} mentions={mentions} />;
    case "LinkMetadata":
      return <LinkView metadata={metadata as LinkMetadataDetails} mentions={mentions} />;
    case "LiveStreamMetadata":
      return <LiveStreamView metadata={metadata as LiveStreamMetadataDetails} mentions={mentions} />;
    case "CheckingInMetadata":
      return <CheckingInView metadata={metadata as CheckingInMetadataDetails} mentions={mentions} />;
    case "EmbedMetadata":
      return <EmbedView metadata={metadata as EmbedMetadataDetails} mentions={mentions} />;
    case "EventMetadata":
      return <EventView metadata={metadata as EventMetadataDetails} mentions={mentions} />;
    case "MintMetadata":
      return <MintView metadata={metadata as MintMetadataDetails} mentions={mentions} />;
    case "SpaceMetadata":
      return <SpaceView metadata={metadata as SpaceMetadataDetails} mentions={mentions} />;
    case "StoryMetadata":
      return <StoryView metadata={metadata as StoryMetadataDetails} mentions={mentions} />;
    case "TransactionMetadata":
      return <TransactionView metadata={metadata as TransactionMetadataDetails} mentions={mentions} />;
    case "ThreeDMetadata":
      return <ThreeDView metadata={metadata as ThreeDMetadataDetails} mentions={mentions} />;
    default:
      return null;
  }
};

const ContentView = ({ content, mentions }: { content: string; mentions?: PostMention[] }) => {
  return <Markdown content={content} mentions={mentions} />;
};

export const TextOnlyView = ({ metadata, mentions }: { metadata: TextOnlyMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const ArticleView = ({ metadata, mentions }: { metadata: ArticleMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const ImageView = ({ metadata, mentions }: { metadata: ImageMetadataDetails; mentions?: PostMention[] }) => {
  const url = metadata?.image?.item;
  const alt = metadata?.image.altTag;
  const title = metadata?.title;

  return (
    <div>
      <ContentView content={metadata.content} mentions={mentions} />
      <div className="relative mt-2 w-full">
        <ImageViewer src={url} alt={alt || title} className="object-cover border w-full rounded-xl h-auto" />
      </div>
    </div>
  );
};

export const VideoView = ({ metadata, mentions }: { metadata: VideoMetadataDetails; mentions?: PostMention[] }) => {
  const url = metadata?.video?.item;
  const cover = metadata?.video?.cover || undefined;

  return (
    <div>
      <ContentView content={metadata.content} mentions={mentions} />
      <VideoPlayer url={url} preview={cover} />
    </div>
  );
};

export const AudioView = ({ metadata, mentions }: { metadata: AudioMetadataDetails; mentions?: PostMention[] }) => {
  const url = metadata?.audio?.item;
  const cover = metadata?.audio.cover;
  const artist = metadata?.audio.artist;
  const title = metadata?.title;

  return (
    <div>
      <ContentView content={metadata.content} mentions={mentions} />
      <AudioPlayer url={url} cover={cover} author={artist} title={title} />
    </div>
  );
};

export const LinkView = ({ metadata, mentions }: { metadata: LinkMetadataDetails; mentions?: PostMention[] }) => {
  return (
    <div>
      <ContentView content={metadata.content} mentions={mentions} />
      <Badge variant="outline" className="text-base rounded-lg p-1 px-2">
        <a className="hover:underline" href={metadata.sharingLink}>
          {metadata.sharingLink}
        </a>
      </Badge>
    </div>
  );
};

export const LiveStreamView = ({ metadata, mentions }: { metadata: LiveStreamMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const CheckingInView = ({ metadata, mentions }: { metadata: CheckingInMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const EmbedView = ({ metadata, mentions }: { metadata: EmbedMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const EventView = ({ metadata, mentions }: { metadata: EventMetadataDetails; mentions?: PostMention[] }) => {
  return (
    <div>
      <h1>Event</h1>
      Starts at: <Badge>{metadata.startsAt}</Badge>
      Ends at: {metadata.endsAt}
      Where: {metadata.location}
    </div>
  );
};

export const MintView = ({ metadata, mentions }: { metadata: MintMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const SpaceView = ({ metadata, mentions }: { metadata: SpaceMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const StoryView = ({ metadata, mentions }: { metadata: StoryMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const TransactionView = ({ metadata, mentions }: { metadata: TransactionMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};

export const ThreeDView = ({ metadata, mentions }: { metadata: ThreeDMetadataDetails; mentions?: PostMention[] }) => {
  return <ContentView content={metadata.content} />;
};
