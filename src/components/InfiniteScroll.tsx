"use client";

import { useCallback, useEffect, useState } from "react";
import { Feed } from "./Feed";
import { LoadingSpinner } from "./LoadingIcon";

export const InfiniteScroll = ({ initialPosts, initialCursor, endpoint }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMorePosts = useCallback(async () => {
    if (loading || !cursor) return;

    setLoading(true);

    try {
      const res = await fetch(`${endpoint}?cursor=${cursor}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Network error");

      const { posts: newPosts, nextCursor } = await res.json();

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setCursor(nextCursor);
    } catch (err) {
      setError(`Could not fetch posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  useEffect(() => {
    const handleScroll = () => {
      /// FIXME: There's probably a better way to do this
      const threshold = 10000;
      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight &&
        !loading
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]);

  if (error) throw new Error(error);

  return (
    <>
      <Feed data={posts} />
      {loading && (
        <div className="w-full h-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};
