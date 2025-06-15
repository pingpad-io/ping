import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { NotificationView } from "~/components/notifications/NotificationView";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your latest notifications",
  openGraph: {
    title: "Notifications",
    description: "Your latest notifications",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const endpoint = "/api/notifications";

const notifications = async () => {
  return (
    <Feed
      ItemView={NotificationView}
      endpoint={endpoint}
    />
  );
};

export default notifications;
