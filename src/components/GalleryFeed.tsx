"use client";

import { useCallback, useEffect, useState } from "react";
import { GallerySuspense } from "./GallerySuspense";
import { LoadingSpinner } from "./LoadingSpinner";

export const GalleryFeed = ({ ItemView, endpoint }) => {
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
      const threshold = 10000;
      if (
        window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight &&
        !loading
      ) {
        loadNextBatch();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadNextBatch]);

  if (error) throw new Error(error);
  if (!data) return <GallerySuspense />;

  const list = data.filter(Boolean).map((item) => <ItemView key={item.id} item={item} />);

  return (
    <div className="grid grid-cols-3 gap-2">
      {list}
      {loading && (
        <div className="col-span-3 w-full h-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
