import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";

interface QuotedPostPreviewProps {
  quotedPost: Post;
}

export function QuotedPostPreview({ quotedPost }: QuotedPostPreviewProps) {
  return (
    <div className="mt-2 p-3 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4">
          <UserAvatar user={quotedPost.author} link={false} card={false} />
        </div>
        <span className="text-sm text-muted-foreground">
          {quotedPost.author.name} @{quotedPost.author.handle}
        </span>
      </div>
      <p className="text-sm line-clamp-3">{quotedPost.metadata?.content || ""}</p>
    </div>
  );
}