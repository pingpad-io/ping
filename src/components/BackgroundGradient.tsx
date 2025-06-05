"use client";

import { useBackgroundTheme } from "~/hooks/useBackgroundTheme";

export function BackgroundGradient() {
  const { currentGradient, mounted } = useBackgroundTheme();
  
  if (!mounted) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: currentGradient
      }}
    />
  );
}