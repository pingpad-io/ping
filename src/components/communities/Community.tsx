import {
  AtSignIcon,
  Bitcoin,
  CameraIcon,
  CircleSlashIcon,
  FrameIcon,
  GlobeIcon,
  HammerIcon,
  KeyboardOffIcon,
  LaughIcon,
  LeafIcon,
  LibraryIcon,
  LineChartIcon,
  MusicIcon,
  PaletteIcon,
  PartyPopperIcon,
  SproutIcon,
  TreeDeciduousIcon,
  WrenchIcon,
} from "lucide-react";

export type Community = {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
};

export const stringToCommunity = (community: string) => {
  let communityName = community;
  if (community.includes("orbcommunities")) {
    communityName = `orb/${community.replace("orbcommunities", "")}`;
  }
  if (community.includes("channel")) {
    communityName = `channel/${community.split("-")[1]}`;
  }
  if (community.includes("pingpad")) {
    communityName = "ping";
  }
  return {
    id: community,
    name: communityName,
    description: null,
    image: null,
  };
};

export const getCommunityIcon = (community: string) => {
  let icon = null;
  switch (community) {
    case "pingpad":
      icon = <AtSignIcon size={18} />;
      break;
    case "orbcommunitieslens":
      icon = <SproutIcon size={18} />;
      break;
    case "orbcommunitiesart":
      icon = <PaletteIcon size={18} />;
      break;
    case "orbcommunitiestrading":
      icon = <LineChartIcon size={18} />;
      break;
    case "orbcommunitiesraave":
      icon = <PartyPopperIcon size={18} />;
      break;
    case "orbcommunitiesafk":
      icon = <KeyboardOffIcon size={18} />;
      break;
    case "orbcommunitiestouchgrass":
      icon = <LeafIcon size={18} />;
      break;
    case "orbcommunitiesphotography":
      icon = <CameraIcon size={18} />;
      break;
    case "orbcommunitiesbonsai":
      icon = <TreeDeciduousIcon size={18} />;
      break;
    case "orbcommunitiesdefi":
      icon = <Bitcoin size={18} />;
      break;
    case "orbcommunitieszk":
      icon = <CircleSlashIcon size={18} />;
      break;
    case "orbcommunitieslips":
      icon = <SproutIcon fill="hsl(var(--primary))" size={18} />;
      break;
    case "orbcommunitiesmetaverse":
      icon = <GlobeIcon size={18} />;
      break;
    case "orbcommunitiesdesign":
      icon = <FrameIcon size={18} />;
      break;
    case "orbcommunitiesvinylandmusic":
      icon = <MusicIcon size={18} />;
      break;
    case "orbcommunitiesmemes":
      icon = <LaughIcon size={18} />;
      break;
    case "orbcommunitiesbooks":
      icon = <LibraryIcon size={18} />;
      break;
    case "orbcommunitiesdevelopers":
      icon = <WrenchIcon size={18} />;
      break;
    case "orbcommunitiesbuild":
      icon = <HammerIcon size={18} />;
      break;
    default:
      icon = null;
      break;
  }
  return icon;
};
