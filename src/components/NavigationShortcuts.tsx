"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { recentlyVisitedPagesAtom } from "~/atoms/recentlyVisited";
import { navigationPositionAtom, showNavigationIndicatorAtom, navigationModeAtom } from "~/atoms/navigation";

export function NavigationShortcuts() {
  const router = useRouter();
  const recentlyVisitedPages = useAtomValue(recentlyVisitedPagesAtom);
  const [navigationPosition, setNavigationPosition] = useAtom(navigationPositionAtom);
  const [navigationMode, setNavigationMode] = useAtom(navigationModeAtom);
  const setShowIndicator = useSetAtom(showNavigationIndicatorAtom);

  const navigate = useCallback((path: string, newPosition: number) => {
    setNavigationPosition(newPosition);
    router.push(path);
  }, [router, setNavigationPosition]);


  // Exit history mode on click outside history indicator
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (navigationMode === "history") {
        // Check if click is inside history indicator
        const historyIndicator = document.querySelector('[data-history-indicator]');
        if (historyIndicator && historyIndicator.contains(event.target as Node)) {
          return; // Don't exit history mode if clicking inside history indicator
        }
        setNavigationMode("normal");
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [navigationMode, setNavigationMode]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const key = event.key.toUpperCase();

      if (key === "H" || key === "L") {
        setNavigationMode("history");
        setShowIndicator(true);
      }

      if (key === "H") {
        if (navigationPosition > 0) {
          const newPosition = navigationPosition - 1;
          const targetPage = recentlyVisitedPages[newPosition];

          if (targetPage) {
            navigate(targetPage.path, newPosition);
          }
        }
      } else if (key === "L") {
        if (navigationPosition < recentlyVisitedPages.length - 1) {
          const newPosition = navigationPosition + 1;
          const targetPage = recentlyVisitedPages[newPosition];

          if (targetPage) {
            navigate(targetPage.path, newPosition);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigationPosition, recentlyVisitedPages, navigate, setNavigationMode, setShowIndicator]);

  return null;
}