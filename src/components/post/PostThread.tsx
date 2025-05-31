"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import type { Post } from "./Post";
import { PostView } from "./PostView";

export function PostThread({ post }: { post: Post }) {
  const [thread, setThread] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchParent(id: string) {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error(res.statusText);
        const { nativePost } = await res.json();
        return nativePost as Post;
      } catch (error) {
        console.error("Failed to fetch parent post", error);
        return null;
      }
    }

    async function load(current: Post | undefined) {
      if (!current) return;
      const parentId = current.commentOn?.id ?? current.quoteOn?.id;
      if (!parentId) return;
      const parent = await fetchParent(parentId);
      if (parent && !cancelled) {
        setThread((prev) => [parent, ...prev]);
        await load(parent);
      }
    }

    load(post);
    return () => {
      cancelled = true;
    };
  }, [post.id]);

  return (
    <div className="flex flex-col gap-4">
      {thread.map((p) => (
        <Card key={p.id} className="z-[30] hover:bg-card p-4 border-0">
          <PostView item={p} />
        </Card>
      ))}
      <Card className="z-[30] hover:bg-card p-4 border-0">
        <PostView item={post} />
      </Card>
    </div>
  );
}
