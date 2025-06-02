import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { CommentSkeleton } from "./PostCommentSkeleton";
import { PostView } from "./PostView";

export const PostComments = ({
  post,
  level,
  isOpen,
  comments,
  setComments,
}: {
  post: Post;
  level: number;
  isOpen: boolean;
  comments: Post[];
  setComments: React.Dispatch<React.SetStateAction<Post[]>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [cursor, setCursor] = useState(undefined);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isOpen ? loadMoreComments() : setComments(post.comments);
  }, [isOpen]);

  const loadMoreComments = useCallback(async () => {
    if (loading || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments?${cursor ? `cursor=${cursor}` : ""}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(res.statusText);
      const { comments: newComments, nextCursor } = await res.json();
      const diffComments = newComments.filter((comment) => !comments.find((c) => c.id === comment.id));
      setComments((prevComments) => [...prevComments, ...diffComments]);
      setCursor(nextCursor);
    } catch (err) {
      setError(`Could not fetch comments: ${err.message}`);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [cursor, loading, post.id]);

  const commentElements = comments.map((comment, index) => (
    <motion.li
      key={comment.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <PostView
        item={comment}
        settings={{
          level,
          isComment: true,
          showBadges: true,
          isLastComment: index === comments.length - 1,
        }}
      />
    </motion.li>
  ));

  if (error) throw new Error(error);

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className={`gap-2 ${level === 2 ? "w-[90%]" : "w-[94%]"}`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <ul className="gap-2 flex flex-col">
                <div>{commentElements}</div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <CommentSkeleton />
          </motion.div>
        )}
        {isOpen && cursor && !loading && (
          <Button variant="ghost" onMouseEnter={loadMoreComments} disabled={loading} className="cursor-pointer">
            <PlusIcon /> Load more Comments
          </Button>
        )}
      </div>
    </div>
  );
};
