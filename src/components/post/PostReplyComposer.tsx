import { AnimatePresence, motion } from "motion/react";
import type { Post } from "./Post";
import PostComposer from "./PostComposer";

export const PostReplyComposer = ({
  post,
  level,
  isOpen,
  setOpen,
  onCommentAdded,
}: {
  post: Post;
  level: number;
  isOpen: boolean;
  setOpen?: (open: boolean) => void;
  onCommentAdded?: (comment?: Post | null) => void;
}) => {
  return (
    <div
      className={`w-full flex flex-col items-end justify-center text-xs sm:text-sm`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={`w-full glass rounded-xl p-2`}
          >
            <PostComposer
              replyingTo={post}
              onSuccess={(comment) => {
                onCommentAdded?.(comment);
                setOpen?.(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
