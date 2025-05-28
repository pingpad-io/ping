"use client";

import { useEffect } from "react";
import { Feed } from "../Feed";
import type { Notification } from "./Notification";
import { NotificationView } from "./NotificationView";
import { useNotifications } from "./NotificationsContext";

export const NotificationsPageClient = ({
  initialData,
  initialCursor,
  endpoint,
}: {
  initialData: Notification[];
  initialCursor: string | undefined;
  endpoint: string;
}) => {
  const { markAllAsRead, highlightSince, setNotifications } = useNotifications();

  useEffect(() => {
    setNotifications(initialData);
    markAllAsRead();
  }, []);

  return (
    <Feed
      ItemView={({ item }: { item: Notification }) => (
        <NotificationView
          item={item}
          highlight={highlightSince !== null && new Date(item.createdAt).getTime() > highlightSince}
        />
      )}
      endpoint={endpoint}
      initialData={initialData}
      initialCursor={initialCursor}
    />
  );
};
