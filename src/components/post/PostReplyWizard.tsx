import { AnimatePresence, motion } from "motion/react";
import type { Post } from "./Post";
import PostWizard from "./PostWizard";

export const PostReplyWizard = ({
  post,
  level,
  isOpen,
  setOpen
}: {
  post: Post;
  level: number;
  isOpen: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <div className={`w-full flex flex-col items-end justify-center text-xs sm:text-sm ${level === 2 ? "w-[90%] ml-auto" : "w-[94%] ml-auto"}`}>
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
            className="w-[90%]"
          >
            <PostWizard replyingTo={post} onSuccess={() => setOpen?.(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
