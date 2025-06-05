"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export interface BackgroundTheme {
  id: string;
  name: string;
  lightColors: {
    color1: string;
    color2: string;
    color3: string;
  };
  darkColors: {
    color1: string;
    color2: string;
    color3: string;
  };
}

// Configurable opacity for gradients
const LIGHT_OPACITY = 0.55;
const DARK_OPACITY = 0.5;

export const backgroundThemes: BackgroundTheme[] = [
  {
    id: "default",
    name: "Default",
    lightColors: {
      color1: `rgba(59, 130, 246, ${LIGHT_OPACITY})`,
      color2: `rgba(16, 185, 129, ${LIGHT_OPACITY})`,
      color3: `rgba(34, 197, 94, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(59, 130, 246, ${DARK_OPACITY})`,
      color2: `rgba(16, 185, 129, ${DARK_OPACITY})`,
      color3: `rgba(34, 197, 94, ${DARK_OPACITY})`,
    },
  },
  {
    id: "purple",
    name: "Purple",
    lightColors: {
      color1: `rgba(139, 92, 246, ${LIGHT_OPACITY})`,
      color2: `rgba(236, 72, 153, ${LIGHT_OPACITY})`,
      color3: `rgba(168, 85, 247, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(139, 92, 246, ${DARK_OPACITY})`,
      color2: `rgba(236, 72, 153, ${DARK_OPACITY})`,
      color3: `rgba(168, 85, 247, ${DARK_OPACITY})`,
    },
  },
  {
    id: "orange",
    name: "Orange",
    lightColors: {
      color1: `rgba(251, 146, 60, ${LIGHT_OPACITY})`,
      color2: `rgba(239, 68, 68, ${LIGHT_OPACITY})`,
      color3: `rgba(245, 101, 101, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(251, 146, 60, ${DARK_OPACITY})`,
      color2: `rgba(239, 68, 68, ${DARK_OPACITY})`,
      color3: `rgba(245, 101, 101, ${DARK_OPACITY})`,
    },
  },
  {
    id: "teal",
    name: "Teal",
    lightColors: {
      color1: `rgba(6, 182, 212, ${LIGHT_OPACITY})`,
      color2: `rgba(16, 185, 129, ${LIGHT_OPACITY})`,
      color3: `rgba(14, 165, 233, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(6, 182, 212, ${DARK_OPACITY})`,
      color2: `rgba(16, 185, 129, ${DARK_OPACITY})`,
      color3: `rgba(14, 165, 233, ${DARK_OPACITY})`,
    },
  },
  {
    id: "rose",
    name: "Rose",
    lightColors: {
      color1: `rgba(244, 63, 94, ${LIGHT_OPACITY})`,
      color2: `rgba(251, 113, 133, ${LIGHT_OPACITY})`,
      color3: `rgba(236, 72, 153, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(244, 63, 94, ${DARK_OPACITY})`,
      color2: `rgba(251, 113, 133, ${DARK_OPACITY})`,
      color3: `rgba(236, 72, 153, ${DARK_OPACITY})`,
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    lightColors: {
      color1: `rgba(99, 102, 241, ${LIGHT_OPACITY})`,
      color2: `rgba(139, 92, 246, ${LIGHT_OPACITY})`,
      color3: `rgba(124, 58, 237, ${LIGHT_OPACITY})`,
    },
    darkColors: {
      color1: `rgba(99, 102, 241, ${DARK_OPACITY})`,
      color2: `rgba(139, 92, 246, ${DARK_OPACITY})`,
      color3: `rgba(124, 58, 237, ${DARK_OPACITY})`,
    },
  },
];

const STORAGE_KEY = "pingpad-background-theme";
const INTENSITY_KEY = "pingpad-background-intensity";

export function useBackgroundTheme() {
  const { theme: colorTheme, resolvedTheme } = useTheme();
  const [backgroundThemeId, setBackgroundThemeId] = useState<string>("purple");
  const [intensity, setIntensity] = useState<number>(0.15); // 0 to 0.3, where 0 is no gradient
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme) {
      const foundTheme = backgroundThemes.find((t) => t.id === storedTheme);
      if (foundTheme) {
        setBackgroundThemeId(storedTheme);
      }
    }

    const storedIntensity = localStorage.getItem(INTENSITY_KEY);
    if (storedIntensity) {
      const parsedIntensity = Number.parseFloat(storedIntensity);
      if (!Number.isNaN(parsedIntensity) && parsedIntensity >= 0 && parsedIntensity <= 0.3) {
        setIntensity(parsedIntensity);
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

  // Save intensity to localStorage when changed
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(INTENSITY_KEY, intensity.toString());
    }
  }, [intensity, mounted]);

  // Apply theme by updating CSS variables
  const applyTheme = useCallback(() => {
    const theme = backgroundThemes.find((t) => t.id === backgroundThemeId) || backgroundThemes[0];
    const isDark = resolvedTheme === "dark" || colorTheme === "dark";
    const baseColors = isDark ? theme.darkColors : theme.lightColors;

    // Parse the base colors and apply intensity
    const applyIntensityToColor = (colorString: string, intensityMultiplier = 1) => {
      // Extract rgba values
      const match = colorString.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        const [_, r, g, b, a] = match;
        const baseOpacity = Number.parseFloat(a);
        const newOpacity = baseOpacity * intensity * intensityMultiplier;
        return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
      }
      return colorString;
    };

    // Update CSS variables on the document root
    const root = document.documentElement;
    // Make top gradient (color1) less intensive (75% of current intensity)
    root.style.setProperty("--bg-gradient-1", applyIntensityToColor(baseColors.color1, 0.75));
    root.style.setProperty("--bg-gradient-2", applyIntensityToColor(baseColors.color2));
    root.style.setProperty("--bg-gradient-3", applyIntensityToColor(baseColors.color3));
    root.style.setProperty("--bg-gradient-intensity", intensity.toString());

    console.log("Applied background theme:", {
      themeId: backgroundThemeId,
      isDark,
      intensity,
      colors: baseColors,
    });
  }, [backgroundThemeId, colorTheme, resolvedTheme, intensity]);

  // Apply theme when theme or background changes
  useEffect(() => {
    if (mounted) {
      applyTheme();
    }
  }, [backgroundThemeId, colorTheme, resolvedTheme, intensity, mounted, applyTheme]);

  const currentTheme = backgroundThemes.find((t) => t.id === backgroundThemeId) || backgroundThemes[0];

  return {
    backgroundThemeId,
    setBackgroundThemeId,
    currentTheme,
    availableThemes: backgroundThemes,
    intensity,
    setIntensity,
    mounted,
    applyTheme,
  };
}
