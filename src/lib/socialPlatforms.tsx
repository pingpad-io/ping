import type { LucideIcon } from "lucide-react";
import { Globe, Link } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";

export interface SocialPlatform {
  value: string;
  label: string;
  placeholder: string;
  prefix: string;
  icon: IconType | LucideIcon;
  getUrl: (value: string) => string;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    value: "x",
    label: "X",
    placeholder: "username",
    prefix: "x.com/",
    icon: FaXTwitter,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?(x|twitter)\.com\//, "");
      username = username.replace(/\/$/, "");
      username = username.replace(/^@/, "");
      return `https://x.com/${username}`;
    },
  },
  {
    value: "website",
    label: "Website",
    placeholder: "example.com",
    prefix: "https://",
    icon: Globe,
    getUrl: (value: string) => (value.startsWith("http") ? value : `https://${value}`),
  },
  {
    value: "telegram",
    label: "Telegram",
    placeholder: "username",
    prefix: "@",
    icon: FaTelegram,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?(t\.me|telegram\.me)\//, "");
      username = username.replace(/\/$/, "");
      username = username.replace(/^@/, "");
      return `https://t.me/${username}`;
    },
  },
  {
    value: "discord",
    label: "Discord",
    placeholder: "username",
    prefix: "@",
    icon: FaDiscord,
    getUrl: (value: string) => `https://discord.com/users/${value.replace(/^@/, "")}`,
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder: "username",
    prefix: "instagram.com/",
    icon: FaInstagram,
    getUrl: (value: string) => {
      // Handle various input formats
      let username = value;
      // Remove URL parts
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?instagram\.com\//, "");
      username = username.replace(/\/$/, ""); // Remove trailing slash
      username = username.replace(/^@/, ""); // Remove @ if present
      return `https://instagram.com/${username}`;
    },
  },
  {
    value: "tiktok",
    label: "TikTok",
    placeholder: "username",
    prefix: "tiktok.com/",
    icon: FaTiktok,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?tiktok\.com\/@?/, "");
      username = username.replace(/\/$/, "");
      username = username.replace(/^@/, "");
      return `https://tiktok.com/@${username}`;
    },
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "username",
    prefix: "youtube.com/",
    icon: FaYoutube,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?youtube\.com\/(@|c\/|channel\/)?/, "");
      username = username.replace(/\/$/, "");
      return `https://youtube.com/${username}`;
    },
  },
  {
    value: "twitch",
    label: "Twitch",
    placeholder: "username",
    prefix: "twitch.tv/",
    icon: FaTwitch,
    getUrl: (value: string) => `https://twitch.tv/${value}`,
  },
  {
    value: "facebook",
    label: "Facebook",
    placeholder: "username",
    prefix: "facebook.com/",
    icon: FaFacebook,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?(facebook|fb)\.com\//, "");
      username = username.replace(/\/$/, "");
      return `https://facebook.com/${username}`;
    },
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    placeholder: "username",
    prefix: "linkedin.com/",
    icon: FaLinkedin,
    getUrl: (value: string) => {
      let username = value;
      username = username.replace(/^https?:\/\//, "");
      username = username.replace(/^(www\.)?linkedin\.com\/(in\/)?/, "");
      username = username.replace(/\/$/, "");
      return `https://linkedin.com/in/${username}`;
    },
  },
  {
    value: "pinterest",
    label: "Pinterest",
    placeholder: "username",
    prefix: "pinterest.com/",
    icon: FaPinterest,
    getUrl: (value: string) => `https://pinterest.com/${value}`,
  },
  {
    value: "reddit",
    label: "Reddit",
    placeholder: "username",
    prefix: "reddit.com/",
    icon: FaReddit,
    getUrl: (value: string) => `https://reddit.com/u/${value}`,
  },
  {
    value: "snapchat",
    label: "Snapchat",
    placeholder: "username",
    prefix: "snapchat.com/",
    icon: FaSnapchat,
    getUrl: (value: string) => `https://snapchat.com/add/${value}`,
  },
  {
    value: "spotify",
    label: "Spotify",
    placeholder: "username",
    prefix: "spotify.com/",
    icon: FaSpotify,
    getUrl: (value: string) => `https://open.spotify.com/user/${value}`,
  },
  {
    value: "bluesky",
    label: "Bluesky",
    placeholder: "username",
    prefix: "bsky.app/",
    icon: SiBluesky,
    getUrl: (value: string) => `https://bsky.app/profile/${value}`,
  },
  {
    value: "link",
    label: "Link",
    placeholder: "url",
    prefix: "",
    icon: Link,
    getUrl: (value: string) => value,
  },
];
