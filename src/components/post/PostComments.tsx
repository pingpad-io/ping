import { PlusIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingIcon";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { PostView } from "./PostView";

export const PostComments = ({ post, isOpen }: { post: Post; isOpen: boolean }) => {
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
    <PostView
      key={comment.id}
      item={comment}
      settings={{
        isComment: true,
        showBadges: true,
        isLastComment: index === comments.length - 1,
      }}
    />
  ));

  if (error) throw new Error(error);

  return (
    <div className="w-full flex flex-col items-end justify-center gap-2 text-xs sm:text-sm">
      <div className="w-[90%] gap-2">
        <ul>{commentElements}</ul>
        {loading && <LoadingSpinner className="p-4" />}
        {isOpen && cursor && !loading && (
          <Button variant="ghost" onMouseEnter={loadMoreComments} disabled={loading} className="cursor-pointer">
            <PlusIcon /> Load more Comments
          </Button>
        )}
      </div>
    </div>
  );
};
