import { motion } from "framer-motion";
import { forwardRef } from "react";
import { LinkPreview } from "../embeds/LinkPreview";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { getPostLinkPreviews, getPostMediaContent, getPostTextContent } from "./PostMetadataView";

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  const textContent = getPostTextContent(post.metadata, post.mentions, false);
  const mediaContent = getPostMediaContent(post.metadata);
  const linkPreviews = getPostLinkPreviews(post.metadata);

  return (
    <div ref={ref} className="space-y-2">
      <motion.div
        initial={false}
        animate={{
          height: collapsed ? "7.5rem" : "auto",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
        className="overflow-hidden relative"
      >
        <div className="whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight">{textContent}</div>
      </motion.div>

      {mediaContent}

      {linkPreviews.length > 0 && (
        <div className="space-y-3">
          <LinkPreview key={`${linkPreviews[0]}-0`} url={linkPreviews[0]} />
        </div>
      )}

      {post.quoteOn && (
        <Card
          className="p-3 border bg-transparent hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/p/${post.quoteOn.id}`;
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5">
              <UserAvatar user={post.quoteOn.author} link={true} card={false} />
            </div>
            <div className="text-sm text-muted-foreground">
              <span>{post.quoteOn.author.handle}</span>
            </div>
          </div>
          <p className="text-sm line-clamp-3 text-foreground/90">
            {getPostTextContent(post.quoteOn.metadata, post.quoteOn.mentions, false)}
          </p>
          {getPostMediaContent(post.quoteOn.metadata) && (
            <div className="mt-2 max-w-full">
              <div className="[&_img]:max-h-48 [&_img]:object-cover [&_video]:max-h-48 [&_.fullscreen-video_video]:!max-h-none [&_.fullscreen-video]:!max-h-none [&_.fullscreen-video]:!h-screen [&_.image-grid]:gap-1 [&_.image-grid_img]:max-h-32 [&>div:not(.fullscreen-video)]:!h-fit [&_.h-full:not(.fullscreen-video)]:!h-fit">
                {getPostMediaContent(post.quoteOn.metadata)}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
});
