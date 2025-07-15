"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSetAtom, useAtomValue } from "jotai";
import { addRecentlyVisitedPageAtom, addRecentlyVisitedCommunityAtom } from "~/atoms/recentlyVisited";
import { navigationPositionAtom, navigationModeAtom, isNavigatingFromHistoryAtom } from "~/atoms/navigation";

export function RouteTracker() {
  const pathname = usePathname();
  const addRecentlyVisited = useSetAtom(addRecentlyVisitedPageAtom);
  const addRecentlyVisitedCommunity = useSetAtom(addRecentlyVisitedCommunityAtom);
  const navigationMode = useAtomValue(navigationModeAtom);
  const isNavigatingFromHistory = useAtomValue(isNavigatingFromHistoryAtom);
  const setNavigationPosition = useSetAtom(navigationPositionAtom);

  useEffect(() => {
    if (navigationMode === "history" || isNavigatingFromHistory) {
      return;
    }

    setNavigationPosition(0);
    if (pathname === "/home") {
      addRecentlyVisited({
        path: pathname,
        title: "Home",
        type: "home",
      });
    } else if (pathname === "/explore") {
      addRecentlyVisited({
        path: pathname,
        title: "Explore",
        type: "explore",
      });
    } else if (pathname === "/activity") {
      addRecentlyVisited({
        path: pathname,
        title: "Activity",
        type: "activity",
      });
    } else if (pathname.startsWith("/c/")) {
      const communityId = pathname.split("/c/")[1];
      if (communityId) {
        addRecentlyVisited({
          path: pathname,
          title: `Community: ${communityId}`,
          type: "community",
          communityId,
        });
        addRecentlyVisitedCommunity(communityId);
      }
    } else if (pathname.startsWith("/u/")) {
      const userId = pathname.split("/u/")[1];
      if (userId && !userId.includes("/")) {
        addRecentlyVisited({
          path: pathname,
          title: `User: ${userId}`,
          type: "user",
          userId,
        });
      }
    }
  }, [pathname, addRecentlyVisited, addRecentlyVisitedCommunity, navigationMode, isNavigatingFromHistory, setNavigationPosition]);

  return null;
}