import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { getPostMediaContent, getPostTextContent } from "./PostMetadataView";

interface QuotedPostPreviewProps {
  quotedPost: Post;
}

export function QuotedPostPreview({ quotedPost }: QuotedPostPreviewProps) {
  const mediaContent = getPostMediaContent(quotedPost.metadata);
  
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
      <p className="text-sm line-clamp-3">
        {getPostTextContent(quotedPost.metadata, quotedPost.mentions, false)}
      </p>
      {mediaContent && (
        <div className="mt-2 max-w-full">
          <div className="[&_img]:max-h-48 [&_img]:object-cover [&_video]:max-h-48 [&_.image-grid]:gap-1 [&_.image-grid_img]:max-h-32 [&>div]:!h-fit [&_.h-full]:!h-fit">
            {mediaContent}
          </div>
        </div>
      )}
    </div>
  );
}