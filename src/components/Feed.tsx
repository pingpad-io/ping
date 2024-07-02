"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedSuspense } from "./FeedSuspense";
import { LoadingSpinner } from "./LoadingIcon";

export const Feed = ({ ItemView, initialData, initialCursor, endpoint }) => {
  const [data, setPosts] = useState(initialData);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMorePosts = useCallback(async () => {
    if (loading || !cursor) return;

    setLoading(true);

    const hasParams = endpoint.includes("?");
    const params = hasParams ? "&" : "?";

    try {
      const res = await fetch(`${endpoint}${params}cursor=${cursor}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(res.statusText);

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
  if (!data) return <FeedSuspense />;

  const list = data.map((item) => <ItemView key={item.id} item={item} />);

  return (
    <>
      {list}
      {loading && (
        <div className="w-full h-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};
