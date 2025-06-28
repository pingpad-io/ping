"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedSuspense } from "./FeedSuspense";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./ui/button";

export const Feed = ({ ItemView, endpoint, manualNextPage = false }) => {
  const [data, setData] = useState(null);
  const [cursor, setCursor] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNextBatch = useCallback(async () => {
    if (loading || (cursor === null && data !== null)) return;

    setLoading(true);

    const hasParams = endpoint.includes("?");
    const paramsMarker = hasParams ? "&" : "?";

    try {
      const res = await fetch(`${endpoint}${paramsMarker}${cursor ? `cursor=${cursor}` : ""}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(res.statusText);

      const { data: newData, nextCursor } = await res.json();

      if (data) {
        setData((prevData) => [...prevData, ...newData]);
      } else {
        setData(newData);
      }
      setCursor(nextCursor);
    } catch (err) {
      setError(`Could not fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, data]);

  useEffect(() => {
    if (!data) {
      loadNextBatch();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      /// FIXME: There's probably a better way to do this
      const threshold = 10000;
      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight &&
        !loading
      ) {
        loadNextBatch();
      }
    };

    // Only add scroll listener if not using manual pagination
    if (!manualNextPage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loadNextBatch, manualNextPage]);

  if (error) throw new Error(error);
  if (!data) return <FeedSuspense />;

  const list = data.filter(Boolean).map((item) => <ItemView key={item.id} item={item} />);

  return (
    <div className="flex flex-col gap-2">
      {list}
      {manualNextPage && cursor !== null && (
        <Button variant="ghost" className="w-full mt-4 hover:bg-secondary/70" onClick={loadNextBatch} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </Button>
      )}
      {!manualNextPage && loading && (
        <div className="w-full h-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
