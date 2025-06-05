"use client";

import { useEffect } from "react";
import { useBackgroundTheme } from "~/hooks/useBackgroundTheme";

export function BackgroundGradient() {
  const { mounted, applyTheme } = useBackgroundTheme();

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme();
    }
  }, [mounted, applyTheme]);

  if (!mounted) {
    return null;
  }

  return <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient" />;
}
