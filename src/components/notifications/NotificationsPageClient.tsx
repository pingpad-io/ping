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
  const { markAllAsRead, highlightIds, setNotifications } = useNotifications();

  useEffect(() => {
    setNotifications(initialData);
    markAllAsRead();
  }, []);

  return (
    <Feed
      ItemView={({ item }: { item: Notification }) => (
        <NotificationView item={item} highlight={highlightIds.includes(item.id)} />
      )}
      endpoint={endpoint}
      initialData={initialData}
      initialCursor={initialCursor}
    />
  );
};
