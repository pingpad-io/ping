import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TimeSince = ({ date }: { date: Date }) => {
  let localeDate = date.toLocaleDateString();
  let localeTime = date.toLocaleTimeString();
  let fullDate = localeDate + " " + localeTime;
  let timeSince = dayjs(date).fromNow();

  return (
    <div className="tooltip text-secondary-content" data-tip={fullDate}>
      <div className="">{timeSince}</div>
    </div>
  );
};

export default TimeSince;
