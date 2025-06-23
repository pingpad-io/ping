import { forwardRef } from "react";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { getPostMetadataView } from "./PostMetadataView";

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  const metadata = getPostMetadataView(post.metadata);

  return (
    <div ref={ref} className="space-y-2">
      <div
        className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
          collapsed ? "line-clamp-5" : "line-clamp-none"
        }`}
      >
        {metadata}
      </div>

      {post.quoteOn && (
        <Card className="p-3 mt-2 border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5">
              <UserAvatar user={post.quoteOn.author} link={true} card={false} />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium">{post.quoteOn.author.name}</span>
              <span>@{post.quoteOn.author.handle}</span>
            </div>
          </div>
          <p className="text-sm line-clamp-3 text-foreground/90">{getPostMetadataView(post.quoteOn.metadata)}</p>
        </Card>
      )}
    </div>
  );
});
