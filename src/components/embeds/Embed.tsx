"use client";

import React from "react";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface EmbedInfo {
  type: "youtube" | null;
  id?: string;
}

interface EmbedProps {
  url: string;
  className?: string;
}

export function detectEmbedType(url: string): EmbedInfo {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      let videoId = null;
      if (hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
      } else if (hostname.includes("youtu.be")) {
        videoId = pathname.slice(1).split("?")[0];
      }
      if (videoId) {
        return { type: "youtube", id: videoId };
      }
    }

  } catch {}

  return { type: null };
}

export const Embed: React.FC<EmbedProps> = ({ url, className = "" }) => {
  const embedInfo = detectEmbedType(url);

  switch (embedInfo.type) {
    case "youtube":
      if (embedInfo.id) {
        return <YouTubeEmbed videoId={embedInfo.id} url={url} className={className} />;
      }
      return null;
    
    default:
      return null;
  }
};