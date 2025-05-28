"use client";

import { P } from "@lens-protocol/client/dist/clients-BTRwdEON";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { Notification } from "./Notification";

interface NotificationsContextValue {
  notifications: Notification[];
  lastSeen: number;
  newCount: number;
  setNotifications: (items: Notification[]) => void;
  markAllAsRead: () => void;
  refresh: () => Promise<void>;
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
  const [newCount, setNewCount] = useState<number>(0);
  const [baseTitle, setBaseTitle] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const computeNewCount = (items: Notification[]) => {
    const newNotifications = items.filter((n) => {
      const notificationTime = new Date(n.createdAt).getTime();
      const isNew = notificationTime > lastSeen;

      if (isNew) {
        console.log("New notification:", {
          id: n.id,
          type: n.type,
          createdAt: n.createdAt,
          notificationTime,
          lastSeen,
          isNew,
          who: n.who.map((u) => ({ name: u.name, handle: u.handle })),
        });

        if (pathname.includes("/notifications")) {
          console.log("Refreshing notifications...");
          router.refresh();
        }
      }

      return isNew;
    });

    return newNotifications.length;
  };

  const setNotifications = (items: Notification[]) => {
    const parsed = items.map((n) => (typeof n.createdAt === "string" ? parseNotification(n) : n));
    parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setNotificationsState(parsed);
    setNewCount(computeNewCount(parsed));
  };

  const refresh = async () => {
    try {
      console.log("Refreshing notifications...");
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        console.error("Failed to refresh notifications:", res.statusText);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.data)) {
        console.log(`Refreshed notifications: ${data.data.length} items`);
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000); // 30 seconds
    return () => clearInterval(interval);
  }, [lastSeen]);

  useEffect(() => {
    setBaseTitle(document.title);
  }, [pathname]);

  useEffect(() => {
    if (!baseTitle) return;
    if (newCount > 0) {
      document.title = `(${newCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [newCount, baseTitle]);

  const markAllAsRead = () => {
    const now = Date.now();
    setNewCount(0);
    setLastSeen(now);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastSeenNotifications", now.toString());
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, lastSeen, newCount, setNotifications, markAllAsRead, refresh }}
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
