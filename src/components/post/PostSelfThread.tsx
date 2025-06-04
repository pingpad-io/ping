"use client";

import { useEffect, useState } from "react";
import Link from "../Link";
import { Button } from "../ui/button";
import type { Post } from "./Post";
import { PostView } from "./PostView";

export function PostSelfThread({ post, depth = 3 }: { post: Post; depth?: number }) {
  const [thread, setThread] = useState<Post[]>([]);
  const [rootId, setRootId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const param = depth === Number.POSITIVE_INFINITY ? "" : `?depth=${depth}`;
        const res = await fetch(`/api/posts/${post.id}/thread${param}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (!cancelled) {
          setThread(data.thread || []);
          setRootId(data.rootId);
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error("Failed to load thread", error);
      }
    }
    if (depth !== 0) load();
    return () => {
      cancelled = true;
    };
  }, [post.id, depth]);

  if (thread.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pl-8 mt-2">
      {thread.map((p) => (
        <PostView key={p.id} item={p} settings={{ inThread: true }} threadDepth={0} />
      ))}
      {hasMore && rootId && (
        <Link href={`/p/${rootId}`} className="w-full">
          <Button variant="outline" className="w-full">
            go to thread
          </Button>
        </Link>
      )}
    </div>
  );
}
