import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { User } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";

interface PostComposerHeaderProps {
  currentUser?: User;
  editingPost?: Post;
  replyingTo?: Post;
  onCancel?: () => void;
  isPosting: boolean;
}

export function PostComposerHeader({
  currentUser,
  editingPost,
  replyingTo,
  onCancel,
  isPosting
}: PostComposerHeaderProps) {
  return (
    <div className="flex items-center justify-between h-5 gap-1 mb-0 pl-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold">{currentUser?.handle || ""}</span>
        {editingPost && (
          <span className="text-muted-foreground">editing</span>
        )}
      </div>
      {editingPost && (
        <div className="ml-auto">
          <Button
            type="button"
            variant="link"
            onClick={onCancel}
            disabled={isPosting}
            className="flex gap-4 w-4 rounded-full hover-expand justify-center [&>span]:hover:scale-110 [&>span]:active:scale-95"
          >
            <span className="transition-transform">
              <XIcon
                size={18}
                strokeWidth={2.2}
                stroke="hsl(var(--muted-foreground))"
                className="transition-all duration-200"
              />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}