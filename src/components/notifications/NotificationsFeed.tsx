"use client";

import { useEffect } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { useNotifications } from "./NotificationsContext";
import { NotificationView } from "./NotificationView";

export function NotificationsFeed() {
  const { notifications, refresh, markAllAsRead, isLoading } = useNotifications();

  useEffect(() => {
    refresh();

    const timer = setTimeout(() => {
      markAllAsRead();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <div className="flex h-[200px] items-center justify-center text-muted-foreground">No notifications yet</div>;
  }

  return (
    <div className="flex flex-col">
      {notifications.map((notification) => (
        <NotificationView key={notification.id} item={notification} />
      ))}
    </div>
  );
}
