import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { getPostMediaContent, getPostTextContent } from "./PostMetadataView";

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  const textContent = getPostTextContent(post.metadata, post.mentions, true);
  const mediaContent = getPostMediaContent(post.metadata);

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

      {post.quoteOn && (
        <Card 
          className="p-3 border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
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
              <div className="[&_img]:max-h-48 [&_img]:object-cover [&_video]:max-h-48 [&_.image-grid]:gap-1 [&_.image-grid_img]:max-h-32 [&>div]:!h-fit [&_.h-full]:!h-fit">
                {getPostMediaContent(post.quoteOn.metadata)}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
});
