"use client";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(duration);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "just now",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years",
  },
});

export const TimeElapsedSince = ({ date }: { date: Date }) => {
  const fullDate = dayjs(date);
  const [timeSince, setTimeSince] = useState(fullDate.fromNow());
  const { refresh } = useRouter();
  const diff = dayjs().diff(fullDate);

  useEffect(() => {
    const onFocus = () => {
      setTimeSince(fullDate.fromNow());
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    if (diff > dayjs.duration(1, "hour").asMilliseconds()) return;

    const interval = setInterval(() => setTimeSince(fullDate.fromNow()), 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (diff > dayjs.duration(3, "weeks").asMilliseconds()) {
    return <span>{fullDate.format("MMM DD")}</span>;
  }

  return <span suppressHydrationWarning>{timeSince}</span>;
};

export const TimeSince = ({ date }: { date: Date }) => {
  const timeSince = dayjs(date).format("MMM YYYY");

  return <span suppressHydrationWarning>{timeSince}</span>;
};
