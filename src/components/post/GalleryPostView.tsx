"use client";

import Link from "../Link";
import { Card } from "../ui/card";
import type { Post } from "./Post";

export const GalleryPostView = ({ item }: { item: Post }) => {
  const metadata = item.metadata;
  const type = metadata?.__typename;

  let src: string | undefined;
  if (type === "ImageMetadata") {
    src = metadata?.image?.item;
  } else if (type === "VideoMetadata") {
    src = metadata?.video?.cover;
  }

  if (!src) return null;

  return (
    <Link href={`/p/${item.id}`}>
      <Card className="overflow-hidden p-0">
        <img src={src} alt="" className="object-cover w-full aspect-square" />
      </Card>
    </Link>
  );
};
