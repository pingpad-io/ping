"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface BackgroundTheme {
  id: string;
  name: string;
  lightGradient: string;
  darkGradient: string;
}

export const backgroundThemes: BackgroundTheme[] = [
  {
    id: "default",
    name: "Default",
    lightGradient: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
  },
  {
    id: "purple",
    name: "Purple",
    lightGradient: "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.1) 0%, transparent 50%)"
  },
  {
    id: "orange",
    name: "Orange",
    lightGradient: "radial-gradient(ellipse at top, rgba(251, 146, 60, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at top, rgba(251, 146, 60, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(239, 68, 68, 0.1) 0%, transparent 50%)"
  },
  {
    id: "teal",
    name: "Teal",
    lightGradient: "radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
  },
  {
    id: "rose",
    name: "Rose",
    lightGradient: "radial-gradient(ellipse at center, rgba(244, 63, 94, 0.05) 0%, transparent 50%), radial-gradient(ellipse at top left, rgba(251, 113, 133, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at center, rgba(244, 63, 94, 0.1) 0%, transparent 50%), radial-gradient(ellipse at top left, rgba(251, 113, 133, 0.1) 0%, transparent 50%)"
  },
  {
    id: "indigo",
    name: "Indigo",
    lightGradient: "radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
    darkGradient: "radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
  }
];

const STORAGE_KEY = "pingpad-background-theme";

export function useBackgroundTheme() {
  const { theme: colorTheme } = useTheme();
  const [backgroundThemeId, setBackgroundThemeId] = useState<string>("default");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const foundTheme = backgroundThemes.find(t => t.id === stored);
      if (foundTheme) {
        setBackgroundThemeId(stored);
      }
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, backgroundThemeId);
    }
  }, [backgroundThemeId, mounted]);

  const currentTheme = backgroundThemes.find(t => t.id === backgroundThemeId) || backgroundThemes[0];
  
  const currentGradient = colorTheme === "dark" 
    ? currentTheme.darkGradient 
    : currentTheme.lightGradient;

  return {
    backgroundThemeId,
    setBackgroundThemeId,
    currentTheme,
    currentGradient,
    availableThemes: backgroundThemes,
    mounted
  };
}