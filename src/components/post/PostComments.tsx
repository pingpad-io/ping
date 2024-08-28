import { PlusIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { PostView } from "./PostView";

export const PostComments = ({ post, level, isOpen }: { post: Post; level: number; isOpen: boolean }) => {
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
    <li key={comment.id} className="animate-in slide-in-from-top-3 duration-300 ease-in-out">
      <PostView
        item={comment}
        settings={{
          level,
          isComment: true,
          showBadges: true,
          isLastComment: index === comments.length - 1,
        }}
      />
    </li>
  ));

  if (error) throw new Error(error);

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className={`gap-2 ${level === 2 ? "w-[90%]" : "w-[94%]"}`}>
        <ul>{commentElements}</ul>
        {loading && <LoadingSpinner className="animate-in fade-in slide-in-from-top-5 duration-500 ease-in-out p-4" />}
        {isOpen && cursor && !loading && (
          <Button variant="ghost" onMouseEnter={loadMoreComments} disabled={loading} className="cursor-pointer">
            <PlusIcon /> Load more Comments
          </Button>
        )}
      </div>
    </div>
  );
};
