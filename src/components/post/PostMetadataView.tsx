import {
  ArticleMetadata,
  ArticleMetadataDetails,
  AudioMetadata,
  AudioMetadataDetails,
  CheckingInMetadata,
  CheckingInMetadataDetails,
  EmbedMetadata,
  EmbedMetadataDetails,
  EventMetadata,
  EventMetadataDetails,
  ImageMetadata,
  ImageMetadataDetails,
  LinkMetadata,
  LinkMetadataDetails,
  LiveStreamMetadata,
  LiveStreamMetadataDetails,
  MintMetadata,
  MintMetadataDetails,
  PostMetadata,
  PostMetadataSchemaId,
  SpaceMetadata,
  SpaceMetadataDetails,
  StoryMetadata,
  StoryMetadataDetails,
  TextOnlyMetadata,
  TextOnlyMetadataDetails,
  ThreeDMetadata,
  ThreeDMetadataDetails,
  TransactionMetadata,
  TransactionMetadataDetails,
  VideoMetadata,
  VideoMetadataDetails,
} from "@lens-protocol/metadata";
import { AudioPlayer } from "../AudioPlayer";
import { ImageViewer } from "../ImageViewer";
import Markdown from "../Markdown";
import { VideoPlayer } from "../VideoPlayer";
import { Badge } from "../ui/badge";

export const getPostMetadataView = (metadata: any) => {
  switch (metadata.__typename) {
    case "TextOnlyMetadata":
      return <TextOnlyView metadata={metadata as TextOnlyMetadataDetails} />;
    case "ArticleMetadata":
      return <ArticleView metadata={metadata as ArticleMetadataDetails} />;
    case "ImageMetadata":
      return <ImageView metadata={metadata as ImageMetadataDetails} />;
    case "VideoMetadata":
      return <VideoView metadata={metadata as VideoMetadataDetails} />;
    case "AudioMetadata":
      return <AudioView metadata={metadata as AudioMetadataDetails} />;
    case "LinkMetadata":
      return <LinkView metadata={metadata as LinkMetadataDetails} />;
    case "LiveStreamMetadata":
      return <LiveStreamView metadata={metadata as LiveStreamMetadataDetails} />;
    case "CheckingInMetadata":
      return <CheckingInView metadata={metadata as CheckingInMetadataDetails} />;
    case "EmbedMetadata":
      return <EmbedView metadata={metadata as EmbedMetadataDetails} />;
    case "EventMetadata":
      return <EventView metadata={metadata as EventMetadataDetails} />;
    case "MintMetadata":
      return <MintView metadata={metadata as MintMetadataDetails} />;
    case "SpaceMetadata":
      return <SpaceView metadata={metadata as SpaceMetadataDetails} />;
    case "StoryMetadata":
      return <StoryView metadata={metadata as StoryMetadataDetails} />;
    case "TransactionMetadata":
      return <TransactionView metadata={metadata as TransactionMetadataDetails} />;
    case "ThreeDMetadata":
      return <ThreeDView metadata={metadata as ThreeDMetadataDetails} />;
    default:
      return null;
  }
};

const ContentView = ({ content }: { content: string }) => {
  return <Markdown content={content} />;
};

export const TextOnlyView = ({ metadata }: { metadata: TextOnlyMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const ArticleView = ({ metadata }: { metadata: ArticleMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const ImageView = ({ metadata }: { metadata: ImageMetadataDetails }) => {
  const url = metadata?.image?.item;
  const alt = metadata?.image.altTag;
  const title = metadata?.title;

  return (
    <div>
      <ContentView content={metadata.content} />
      <div className="relative mt-2 w-full">
        <ImageViewer src={url} alt={alt || title} className="object-cover border w-full rounded-xl h-auto" />
      </div>
    </div>
  );
};

export const VideoView = ({ metadata }: { metadata: VideoMetadataDetails }) => {
  const url = metadata?.video?.item;
  const cover = metadata?.video.cover;

  return (
    <div>
      <ContentView content={metadata.content} />
      <VideoPlayer url={url} preview={cover} />
    </div>
  );
};

export const AudioView = ({ metadata }: { metadata: AudioMetadataDetails }) => {
  const url = metadata?.audio?.item;
  const cover = metadata?.audio.cover;
  const artist = metadata?.audio.artist;
  const title = metadata?.title;

  return (
    <div>
      <ContentView content={metadata.content} />
      <AudioPlayer url={url} cover={cover} author={artist} title={title} />
    </div>
  );
};

export const LinkView = ({ metadata }: { metadata: LinkMetadataDetails }) => {
  return (
    <div>
      <ContentView content={metadata.content} />
      <Badge variant="outline" className="text-base rounded-lg p-1 px-2">
        <a className="hover:underline" href={metadata.sharingLink}>
          {metadata.sharingLink}
        </a>
      </Badge>
    </div>
  );
};

export const LiveStreamView = ({ metadata }: { metadata: LiveStreamMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const CheckingInView = ({ metadata }: { metadata: CheckingInMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const EmbedView = ({ metadata }: { metadata: EmbedMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const EventView = ({ metadata }: { metadata: EventMetadataDetails }) => {
  return (
    <div>
      <h1>Event</h1>
      Starts at: <Badge>{metadata.startsAt}</Badge>
      Ends at: {metadata.endsAt}
      Where: {metadata.location}
    </div>
  );
};

export const MintView = ({ metadata }: { metadata: MintMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const SpaceView = ({ metadata }: { metadata: SpaceMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const StoryView = ({ metadata }: { metadata: StoryMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const TransactionView = ({ metadata }: { metadata: TransactionMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};

export const ThreeDView = ({ metadata }: { metadata: ThreeDMetadataDetails }) => {
  return <ContentView content={metadata.content} />;
};
