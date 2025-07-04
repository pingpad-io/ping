"use client";

import { useState } from "react";
import type { Post } from "./post/Post";
import PostComposer from "./post/PostComposer";
import { PostView } from "./post/PostView";
import type { User } from "./user/User";

export const FeedPostComposer = ({ user }: { user?: User }) => {
  const [newPosts, setNewPosts] = useState<Post[]>([]);

  const handleSuccess = (newPost?: Post | null) => {
    if (newPost) {
      if ((newPost as any).isOptimistic) {
        setNewPosts((prev) => [...prev, newPost]);
      } else {
        setNewPosts((prev) => prev.map(post => post.id.startsWith('optimistic') && newPost.metadata?.content === post.metadata?.content ? newPost : post)
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 glass rounded-xl">
        <PostComposer user={user} onSuccess={handleSuccess} />
      </div>
      {newPosts.length > 0 && (
        <div className="flex flex-col gap-2">
          {newPosts.map((post) => (
            <div key={post.id} className="">
              <PostView item={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

