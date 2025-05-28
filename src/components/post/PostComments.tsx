import { PlusCircleIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { PostView } from "./PostView";
import { CommentSkeleton } from "./PostCommentSkeleton";

export const PostComments = ({
  post,
  level,
  isOpen,
  onReply,
}: {
  post: Post;
  level: number;
  isOpen: boolean;
  onReply: () => void;
}) => {
  const [comments, setComments] = useState(post.comments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(undefined);

  useEffect(() => {
    isOpen ? loadMoreComments() : setComments(post.comments);
  }, [isOpen]);

  const loadMoreComments = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments?${cursor ? `cursor=${cursor}` : ""}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(res.statusText);
      const { comments: newComments, nextCursor } = await res.json();
      const diffComments = newComments.filter((comment) => !post.comments.find((c) => c.id === comment.id));
      setComments((prevComments) => [...prevComments, ...diffComments]);
      setCursor(nextCursor);
    } catch (err) {
      setError(`Could not fetch comments: ${err.message}`);
    } finally {
      setLoading(false);
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

  const replyElement = isOpen ? (
    <motion.li
      key="reply"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <Button variant="ghost" onClick={onReply} className="flex flex-row items-center gap-1">
        <PlusCircleIcon size={16} /> Reply
      </Button>
    </motion.li>
  ) : null;

  if (error) throw new Error(error);

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className={`gap-2 ${level === 2 ? "w-[90%]" : "w-[94%]"}`}>
        <AnimatePresence>
          <ul>
            {replyElement}
            {commentElements}
          </ul>
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
