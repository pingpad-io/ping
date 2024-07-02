import { Feed } from "~/components/Feed";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { NotificationView } from "~/components/notifications/NotificationView";
import { getLensClient } from "~/utils/getLensClient";

const endpoint = "/api/notifications";

const notifications = async () => {
  const { notifications, nextCursor } = await getInitialFeed();

  if (!notifications) {
    throw new Error("Failed to get notifications (T T)");
  }

  return (
    <Feed ItemView={NotificationView} endpoint={endpoint} initialData={notifications} initialCursor={nextCursor} />
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
