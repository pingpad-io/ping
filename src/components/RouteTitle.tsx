"use client";
import { BellIcon, BookmarkIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const RouteTitle = () => {
  const pathname = usePathname();
  const path = pathname.split("/").slice(1);
  const icon = getRouteIcon(pathname);

  return (
    <div className="relative w-full h-24 flex flex-col items-center justify-center rounded-lg overflow-visible">
      {/* <div className="absolute -z-10 -inset-x-24 inset-y-0 w-[calc(100%+12rem)] aspect-video left-1/2 -translate-x-1/2">
        <BGPattern variant="grid" mask="fade-edges-bottom" fill="secondary" size={24} />
      </div> */}
      <h1 className="text-3xl font-bold py-2 flex flex-row gap-2 items-center relative z-20">
        {icon} {path}
      </h1>
    </div>
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
    case "/communities":
      return <UsersIcon strokeWidth={2.5} className="-mb-1" />;
    default:
      return <HomeIcon strokeWidth={2.5} className="-mb-1" />;
  }
};
