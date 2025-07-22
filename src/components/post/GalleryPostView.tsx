"use client";

import type { Post } from "@cartel-sh/ui";
import Link from "../Link";
import { Card } from "../ui/card";

export const GalleryPostView = ({ item }: { item: Post }) => {
  const metadata = item.metadata;
  const type = metadata?.__typename;

  let src: string | undefined;
  let isVideo = false;

  if (type === "ImageMetadata") {
    src = metadata?.image?.item;
  } else if (type === "VideoMetadata") {
    src = metadata?.video?.cover;
    isVideo = true;
    if (!src && metadata?.video?.item) {
      src = metadata.video.item;
    }
  }

  if (!src && !isVideo) return null;

  return (
    <Link href={`/p/${item.id}`}>
      <Card className="overflow-hidden p-0">
        {isVideo && !metadata?.video?.cover ? (
          <div className="relative w-full aspect-square bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        ) : (
          <img src={src} alt="" className="object-cover w-full aspect-square" />
        )}
      </Card>
    </Link>
  );
};
