"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate, formatMonthYear, getTimeAgo } from "~/utils/formatTime";

export const TimeElapsedSince = ({ date }: { date: Date | string }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const [timeSince, setTimeSince] = useState(() => getTimeAgo(dateObj));
  const { refresh } = useRouter();

  useEffect(() => {
    const updateTime = () => {
      setTimeSince(getTimeAgo(dateObj));
    };

    const onFocus = () => {
      updateTime();
    };

    window.addEventListener("focus", onFocus);

    const diffInMs = Date.now() - dateObj.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours <= 1) {
      const interval = setInterval(updateTime, 60000);
      return () => {
        clearInterval(interval);
        window.removeEventListener("focus", onFocus);
      };
    }

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [dateObj, refresh]);

  const diffInWeeks = (Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24 * 7);
  if (diffInWeeks > 3) {
    return <span>{formatDate(dateObj)}</span>;
  }

  return <span>{timeSince}</span>;
};

export const TimeSince = ({ date }: { date: Date | string }) => {
  return <span>{formatMonthYear(date)}</span>;
};
