"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface YouTubeEmbedProps {
  videoId: string;
  url: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [showEmbed, setShowEmbed] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!showEmbed) {
    return (
      <div
        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer group ${className}`}
        onClick={() => setShowEmbed(true)}
      >
        <img
          src={thumbnailUrl}
          alt="YouTube video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackThumbnailUrl;
          }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Play className="h-8 w-8 text-white fill-white" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="absolute inset-0" />
          <div className="relative z-10 text-center space-y-2">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading video...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};
