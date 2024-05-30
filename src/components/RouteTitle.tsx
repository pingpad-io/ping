"use client";
import { BellIcon, BookmarkIcon, HomeIcon, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const RouteTitle = () => {
  const pathname = usePathname();
  const path = pathname.split("/").slice(1);
  const icon = getRouteIcon(pathname);

  return (
    <h1 className="text-xl font-bold py-4 flex flex-row gap-2 items-center">
      {icon} {path}
    </h1>
  );
};

const getRouteIcon = (route: string) => {
  switch (route) {
    case "/bookmarks":
      return <BookmarkIcon strokeWidth={2.5} className="-mb-1" />;
    case "/settings":
      return <SettingsIcon strokeWidth={2.5} className="-mb-1" />;
    case "/notifications":
      return <BellIcon strokeWidth={2.5} className="-mb-1" />;
    default:
      return <HomeIcon strokeWidth={2.5} className="-mb-1" />;
  }
};
