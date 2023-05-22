import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const TimeElapsed = ({ date }: { date: Date }) => {
  let localeDate = date.toLocaleDateString();
  let localeTime = date.toLocaleTimeString();
  let fullDate = localeDate + " " + localeTime;
  let timeSince = dayjs(date).fromNow();

  return (
    <div className="tooltip" data-tip={fullDate}>
      <div className="">{timeSince}</div>
    </div>
  );
};

export const TimeSince = ({ date }: { date: Date }) => {
  let dateTime = new Date(date);
  let localeDate = dateTime.toLocaleDateString();
  let localeTime = dateTime.toLocaleTimeString();
  let fullDate = localeDate + " " + localeTime;
  let timeSince = dayjs(date).format("MMM YYYY");

  return (
    <div className="tooltip" data-tip={fullDate}>
      <div className="">{timeSince}</div>
    </div>
  );
};
