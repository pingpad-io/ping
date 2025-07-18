import { XIcon } from "lucide-react";
import type { Post } from "~/lib/types/post";
import type { User } from "~/lib/types/user";
import { Button } from "../ui/button";

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
  isPosting,
}: PostComposerHeaderProps) {
  return (
    <div className="flex items-center justify-between h-5 gap-1 mb-0 pl-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold">{currentUser?.handle || ""}</span>
        {editingPost && <span className="text-muted-foreground">editing</span>}
      </div>
      {editingPost && (
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={isPosting}
            className="h-8 w-8 rounded-full hover:bg-transparent button-hover-bg button-hover-bg-equal"
          >
            <XIcon
              size={18}
              strokeWidth={2.2}
              stroke="hsl(var(--muted-foreground))"
              className="transition-all duration-200"
            />
          </Button>
        </div>
      )}
    </div>
  );
}
