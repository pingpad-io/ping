"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedSuspense } from "./FeedSuspense";
import { LoadingSpinner } from "./LoadingIcon";

export const Feed = ({ ItemView, initialData, initialCursor, endpoint }) => {
  const [data, setData] = useState(initialData);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNextBatch = useCallback(async () => {
    if (loading) return;

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
  }, [cursor, loading]);

  useEffect(() => {
    const handleInitialLoad = () => {
      if (!data) {
        loadNextBatch();
      }
    };
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

    handleInitialLoad();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadNextBatch]);

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
