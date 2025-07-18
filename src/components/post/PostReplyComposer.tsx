import { AnimatePresence } from "motion/react";
import type { Post } from "~/lib/types/post";
import { Card } from "../ui/card";
import PostComposer from "./PostComposer";

export const PostReplyComposer = ({
  post,
  level,
  isOpen,
  setOpen,
  onCommentAdded,
  isReplyingToComment = false,
}: {
  post: Post;
  level: number;
  isOpen: boolean;
  setOpen?: (open: boolean) => void;
  onCommentAdded?: (comment?: Post | null) => void;
  isReplyingToComment?: boolean;
}) => {
  return (
    <div className={"w-full flex flex-col items-end justify-center text-xs sm:text-sm"}>
      <AnimatePresence>
        {isOpen && (
          <Card className={"w-full p-4 rounded-xl !rounded-t-none !border-t-0"}>
            <PostComposer
              replyingTo={post}
              onSuccess={(comment) => {
                onCommentAdded?.(comment);
                setOpen?.(false);
              }}
              isReplyingToComment={isReplyingToComment}
            />
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
};
