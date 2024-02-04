import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(duration);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "just now",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1 month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export const TimeElapsedSince = ({ date }: { date: Date }) => {
  const fullDate = dayjs(date);
  const timeSince = fullDate.fromNow();
  const diff = dayjs().diff(fullDate);

  if (diff > dayjs.duration(3, "weeks").asMilliseconds()) {
    return <span>{fullDate.format("MMM DD")}</span>;
  }
  return <span>{timeSince}</span>;
};

export const TimeSince = ({ date }: { date: Date }) => {
  const timeSince = dayjs(date).format("MMM YYYY");

  return <span>{timeSince}</span>;
};
