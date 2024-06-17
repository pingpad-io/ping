import { forwardRef } from "react";
import type { Post } from "./Post";
import { getPostMetadataView } from "./PostMetadataView";

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  const metadata = getPostMetadataView(post.metadata);

  return (
    <div
      ref={ref}
      className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
        collapsed ? "line-clamp-5" : "line-clamp-none"
      }`}
    >
      {metadata}
    </div>
  );
});
