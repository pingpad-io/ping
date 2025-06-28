import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { NotificationView } from "~/components/notifications/NotificationView";

export const metadata: Metadata = {
  title: "Activity",
  description: "Your latest activity",
  openGraph: {
    title: "Activity",
    description: "Your latest activity",
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
  return <Feed ItemView={NotificationView} endpoint={endpoint} />;
};

export default notifications;
