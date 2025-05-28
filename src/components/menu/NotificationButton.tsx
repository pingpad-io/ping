"use client";

import { BellIcon } from "lucide-react";
import Link from "~/components/Link";
import { useNotifications } from "~/components/notifications/NotificationsContext";
import { Button } from "~/components/ui/button";

export const NotificationButton = () => {
  const { newCount } = useNotifications();

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="w-10 h-10 relative">
        <BellIcon size={20} strokeWidth={2.5} />
        {newCount > 0 && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
            {newCount}
          </span>
        )}
      </Button>
    </Link>
  );
};
