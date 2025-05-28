import { motion, AnimatePresence } from "motion/react";
import type { Post } from "./Post";
import PostWizard from "./PostWizard";

export const PostReplyWizard = ({ post, level, isOpen }: { post: Post; level: number; isOpen: boolean }) => {
  return (
    <div className="w-full flex flex-col items-end justify-center text-xs sm:text-sm">
      <AnimatePresence>
        {isOpen && post && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            className={`gap-2 ${level === 2 ? "w-[90%]" : "w-[94%]"
              }`}
          >
            <PostWizard replyingTo={post} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
