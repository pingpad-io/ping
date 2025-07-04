"use client";

import { EditIcon, RefreshCwIcon, Repeat2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { Post } from "./Post";
import PostComposer from "./PostComposer";

interface RepostDropdownProps {
  post: Post;
  variant?: "post" | "comment";
  reactions: {
    reacted: boolean;
    count: number;
    canRepost: boolean;
    canQuote: boolean;
  };
  onRepostChange: (isReposted: boolean, count: number) => void;
}

export default function RepostDropdown({ post, variant = "post", reactions, onRepostChange }: RepostDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { requireAuth } = useAuth();

  const handleRepost = async (action: "toggle" | "create" = "toggle") => {
    if (!reactions.canRepost) {
      toast.error("You cannot repost this post");
      return;
    }

    setDropdownOpen(false);

    const isUndo = action === "toggle" && reactions.reacted;
    const newCount = isUndo ? reactions.count - 1 : reactions.count + 1;
    const wasReacted = reactions.reacted;

    onRepostChange(action === "create" ? true : !wasReacted, newCount);

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const error = await response.json();
        onRepostChange(wasReacted, reactions.count);
        throw new Error(error.message || "Failed to repost");
      }
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to repost");
      onRepostChange(wasReacted, reactions.count);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuote = () => {
    if (!reactions.canQuote) {
      toast.error("You cannot quote this post");
      return;
    }
    setDropdownOpen(false);
    // Delay opening the dialog to ensure dropdown is fully closed
    setTimeout(() => {
      setShowQuoteDialog(true);
    }, 100);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isLoading}
            className={cn(
              "flex flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3 h-9 min-w-[2rem] [&>span:first-child]:hover:scale-110 [&>span:first-child]:active:scale-95",
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="transition-transform">
              <RefreshCwIcon
                size={variant === "post" ? 18 : 16}
                strokeWidth={reactions.reacted ? 3 : 2}
                stroke={reactions.reacted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                className="transition-all duration-200"
              />
            </span>
            {reactions.count > 0 && (
              <span
                className={cn(
                  "text-xs font-bold transition-colors duration-200",
                  reactions.reacted ? "text-primary" : "text-muted-foreground",
                )}
              >
                {reactions.count}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => requireAuth(() => handleRepost("toggle"))} className="gap-2">
            <Repeat2Icon size={18} strokeWidth={2} />
            <span>{reactions.reacted ? "Undo repost" : "Repost"}</span>
          </DropdownMenuItem>
          {reactions.reacted && (
            <DropdownMenuItem onClick={() => requireAuth(() => handleRepost("create"))} className="gap-2">
              <Repeat2Icon size={18} strokeWidth={2} />
              <span>Repost again</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => requireAuth(handleQuote)} className="gap-2">
            <EditIcon size={18} strokeWidth={2} />
            <span>Quote</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-2xl">
          <PostComposer
            postType="post"
            quotedPost={post}
            onClose={() => setShowQuoteDialog(false)}
            onSuccess={(newPost) => {
              setShowQuoteDialog(false);
              if (newPost) {
                router.push(`/p/${newPost.id}`);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
