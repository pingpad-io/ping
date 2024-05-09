import ErrorPage from "~/components/ErrorPage";
import { NotificationsFeed } from "~/components/Feed";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const notifications = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  if (isAuthenticated) {
    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true } });

    if (data.isFailure()) return <ErrorPage title={`Couldn't fetch posts: ${data.error} `} />;

    const items = data.unwrap().items;
    const notifications = items
      ?.map((notification) => lensNotificationToNative(notification))
      .filter((notification) => notification);
    console.log(data);

    return (
      <Card className="z-[30] hover:bg-card p-4 border-0">
        <NotificationsFeed data={notifications} />
      </Card>
    );
  }
};

export default notifications;
