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

  // Initialize the previous height when component mounts
  useEffect(() => {
    if (containerRef.current) {
      previousHeightRef.current = containerRef.current.scrollHeight;
    }
  }, []);

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
        // Capture scroll position before state update
        const viewport = containerRef.current?.closest('[data-overlayscrollbars-viewport]') as HTMLElement | null;
        const currentScrollTop = viewport?.scrollTop || 0;
        
        setThread((prev) => {
          requestAnimationFrame(() => {
            const currentViewport = containerRef.current?.closest('[data-overlayscrollbars-viewport]') as HTMLElement | null;
            if (!currentViewport) {
              console.log("No viewport found, skipping scroll adjustment");
              return;
            }
            
            if (isFirstLoadRef.current && mainPostRef.current) {
              isFirstLoadRef.current = false;
              // Scroll to the main post at the bottom
              currentViewport.scrollTop = mainPostRef.current.offsetTop;
            } else if (containerRef.current) {
              // Calculate how much height was added above the current scroll position
              const newHeight = containerRef.current.scrollHeight;
              const heightDifference = newHeight - previousHeightRef.current;
              
              if (heightDifference > 0) {
                // Adjust scroll position to maintain visual position
                currentViewport.scrollTop = currentScrollTop + heightDifference;
              }
            }
            
            if (containerRef.current) {
              previousHeightRef.current = containerRef.current.scrollHeight;
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
