"use client";

import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { Notification } from "./Notification";

interface NotificationsContextValue {
  notifications: Notification[];
  lastSeen: number;
  newCount: number;
  highlightIds: string[];
  setNotifications: (items: Notification[]) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

function parseNotification(raw: any): Notification {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    actedOn: raw.actedOn
      ? {
          ...raw.actedOn,
          createdAt: new Date(raw.actedOn.createdAt),
          updatedAt: raw.actedOn.updatedAt ? new Date(raw.actedOn.updatedAt) : undefined,
        }
      : undefined,
  } as Notification;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotificationsState] = useState<Notification[]>([]);
  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now();
    const stored = window.localStorage.getItem("lastSeenNotifications");
    return stored ? Number.parseInt(stored, 10) : Date.now();
  });
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [newCount, setNewCount] = useState<number>(0);

  const computeNewCount = (items: Notification[]) =>
    items.filter((n) => new Date(n.createdAt).getTime() > lastSeen).length;

  const setNotifications = (items: Notification[]) => {
    const parsed = items.map((n) => (typeof n.createdAt === "string" ? parseNotification(n) : n));
    setNotificationsState(parsed);
    setNewCount(computeNewCount(parsed));
  };

  const refresh = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [lastSeen]);

  const markAllAsRead = () => {
    const now = Date.now();
    const newIds = notifications.filter((n) => new Date(n.createdAt).getTime() > lastSeen).map((n) => n.id);
    setHighlightIds(newIds);
    setNewCount(0);
    setLastSeen(now);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastSeenNotifications", now.toString());
    }
    setTimeout(() => setHighlightIds([]), 300);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, lastSeen, newCount, highlightIds, setNotifications, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
