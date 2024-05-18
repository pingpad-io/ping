import { NotificationsFeed } from "~/components/Feed";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const notifications = async () => {
  const { client, isAuthenticated } = await getLensClient();

  if (isAuthenticated) {
    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true } }).catch((error) => {
      throw new Error(error.message);
    });

    if (data.isFailure()) throw new Error(data.error.message);

    const items = data.unwrap().items;
    const notifications = items?.map((notification) => lensNotificationToNative(notification));

    return (
      <Card className="z-[30] hover:bg-card p-4 border-0">
        <NotificationsFeed data={notifications} />
      </Card>
    );
  }
};

export default notifications;
