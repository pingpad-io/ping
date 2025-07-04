"use client";

import { useEffect, useState } from "react";
import { useAuthorThread } from "~/hooks/useAuthorThread";
import { useParentThread } from "~/hooks/useParentThread";
import { useScrollManagement } from "~/hooks/useScrollManagement";
import type { Post } from "./Post";
import { PostReplyComposer } from "./PostReplyComposer";
import { PostSuspense } from "./PostSuspense";
import { PostView } from "./PostView";

export function PostThread({ post }: { post: Post }) {
  const [comments, setComments] = useState<Post[]>([]);
  const [allComments, setAllComments] = useState<Post[]>([]);
  const [showReply, setShowReply] = useState(true);

  const { parentThread, loading: parentThreadLoading } = useParentThread(post);
  const { authorThread, loading: authorThreadLoading } = useAuthorThread(post);
  const { containerRef, mainPostRef } = useScrollManagement({
    parentThread,
    loading: parentThreadLoading,
  });

  useEffect(() => {
    setComments(allComments.filter((comment) => !authorThread.some((authorPost) => authorPost.id === comment.id)));
  }, [allComments, authorThread]);

  useEffect(() => {
    if (!parentThreadLoading && !authorThreadLoading && allComments.length === 0) {
      setAllComments(post.comments || []);
    }
  }, [parentThreadLoading, authorThreadLoading, post.comments, allComments.length]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1 p-4">
      {parentThread.map((p) => (
        <div key={p.id} className="relative">
          <PostView settings={{ inThread: true }} item={p} />
        </div>
      ))}

      {parentThreadLoading && <PostSuspense />}

      <div className="flex flex-col gap-1 min-h-screen">
        <div ref={mainPostRef} className="relative">
          <PostView item={post} defaultExpanded={true} defaultCommentsOpen={false} defaultReplyOpen={false} />
        </div>

        {authorThreadLoading && <PostSuspense />}

        {authorThread.map((p) => (
          <div key={p.id} className="relative">
            <PostView settings={{ inThread: true }} item={p} />
          </div>
        ))}

        <PostReplyComposer post={post} level={0} isOpen={showReply} setOpen={setShowReply} />
      </div>
    </div>
  );
}
