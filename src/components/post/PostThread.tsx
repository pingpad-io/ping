"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "./Post";
import { PostView } from "./PostView";

export function PostThread({ post }: { post: Post }) {
  const [thread, setThread] = useState<Post[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const mainPostRef = useRef<HTMLDivElement>(null);

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

      const currentScrollY = window.scrollY;
      const containerTop = containerRef.current?.getBoundingClientRect().top || 0;
      const scrollFromContainer = currentScrollY + containerTop;

      const parent = await fetchParent(parentId);
      if (parent && !cancelled) {
        setThread((prev) => {
          requestAnimationFrame(() => {
            if (isFirstLoadRef.current) {
              isFirstLoadRef.current = false;
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "instant",
              });
            } else {
              const newContainerTop = containerRef.current?.getBoundingClientRect().top || 0;
              const heightDifference = currentScrollY + containerTop - (currentScrollY + newContainerTop);

              if (heightDifference > 0) {
                window.scrollTo({
                  top: currentScrollY + heightDifference,
                  behavior: "instant",
                });
              }
            }
          });

          return [parent, ...prev];
        });
        await load(parent);
      }
    }

    load(post);
    return () => {
      cancelled = true;
    };
  }, [post.id]);

  return (
    <div ref={containerRef} className="flex flex-col">
      {thread.map((p) => (
        <div key={p.id} className="relative">
          <PostView settings={{ inThread: true }} item={p} />
        </div>
      ))}

      <div ref={mainPostRef} className="relative min-h-screen">
        <PostView item={post} />
      </div>
    </div>
  );
}
