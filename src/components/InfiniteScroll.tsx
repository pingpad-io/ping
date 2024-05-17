"use client";

import { useCallback, useEffect, useState } from "react";
import { Feed } from "./Feed";

export const InfiniteScrollFeed = ({ initialPosts, initialCursor, isAuthenticated, profileId }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMorePosts = useCallback(async () => {
    console.log("loadMorePosts");
    if (loading || !cursor) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts?cursor=${cursor}&profileId=${profileId}&isAuthenticated=${isAuthenticated}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Network response was not ok");

      const { posts: newPosts, nextCursor } = await res.json();

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setCursor(nextCursor);
    } catch (err) {
      setError("Could not fetch more posts");
    } finally {
      setLoading(false);
    }
  }, [cursor, isAuthenticated, profileId, loading]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 200; 
      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight && !loading
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]);

  if (error) return <div>{error}</div>;

  return (
    <>
      <Feed data={posts} />
      {loading && <div>Loading more posts...</div>}
    </>
  );
};
