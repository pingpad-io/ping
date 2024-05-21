import { BellIcon } from "lucide-react";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/notifications";

const notifications = async () => {
  const { notifications, nextCursor } = await getInitialFeed();

  if (!notifications) {
    throw new Error("Failed to get notifications (T T)");
  }

  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <h1 className="text-xl font-bold p-4 flex flex-row gap-2 items-center">
        <BellIcon className="-mb-1" fill="hsl(var(--foreground))" /> notifications
      </h1>
      <InfiniteScroll endpoint={endpoint} initialData={notifications} initialCursor={nextCursor} />
    </Card>
  );
};

const getInitialFeed = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (isAuthenticated) {
    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true } }).catch((error) => {
      throw new Error(error.message);
    });

    if (data.isFailure()) throw new Error(data.error.message);

    const items = data.unwrap();
    const notifications = items.items?.map((notification) => lensNotificationToNative(notification));

    return { notifications, nextCursor: items.pageInfo.next };
  }
  throw new Error("Unauthorized TT");
};

export default notifications;
