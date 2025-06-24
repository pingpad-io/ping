"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { backgroundColors, useBackgroundTheme } from "~/hooks/useBackgroundTheme";

export function BackgroundGradient() {
  const { backgroundMode, intensity, backgroundColorId, blur, backgroundImageUrl } = useBackgroundTheme();
  const { resolvedTheme } = useTheme();

  const gradientPattern = useMemo(() => {
    const color = backgroundColors.find((c) => c.id === backgroundColorId) || backgroundColors[0];
    const isDark = resolvedTheme === "dark";
    const baseOpacity = isDark ? 0.6 : 0.65;
    const opacity = baseOpacity * intensity;

    const { r, g, b } = color.rgb;

    let color1: string;
    let color2: string;
    let color3: string;

    if (color.id === "default") {
      if (isDark) {
        color1 = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
        color2 = `rgba(${r + 20}, ${g + 20}, ${b + 20}, ${opacity * 0.6})`;
        color3 = `rgba(${r - 20}, ${g - 20}, ${b - 20}, ${opacity * 0.4})`;
      } else {
        color1 = `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`;
        color2 = `rgba(${r - 20}, ${g - 20}, ${b - 20}, ${opacity * 0.5})`;
        color3 = `rgba(${r + 20}, ${g + 20}, ${b + 20}, ${opacity * 0.3})`;
      }
    } else if (color.id === "black_and_white") {
      if (isDark) {
        color1 = `rgba(255, 255, 255, ${opacity * 0.75})`;
        color2 = `rgba(128, 128, 128, ${opacity})`;
        color3 = `rgba(64, 64, 64, ${opacity})`;
      } else {
        color1 = `rgba(0, 0, 0, ${opacity * 0.75})`;
        color2 = `rgba(128, 128, 128, ${opacity})`;
        color3 = `rgba(192, 192, 192, ${opacity})`;
      }
    } else {
      const clamp = (val: number) => Math.min(Math.max(val, 0), 255);
      const shift = 30;
      color1 = `rgba(${r}, ${g}, ${b}, ${opacity * 0.75})`;
      color2 = `rgba(${clamp(r + shift)}, ${clamp(g - shift / 2)}, ${clamp(b + shift / 2)}, ${opacity})`;
      color3 = `rgba(${clamp(r - shift / 2)}, ${clamp(g + shift / 2)}, ${clamp(b - shift)}, ${opacity})`;
    }

    return `radial-gradient(ellipse at top, ${color1} 0%, transparent 70%), radial-gradient(ellipse at bottom right, ${color2} 0%, transparent 70%), radial-gradient(ellipse at center left, ${color3} 0%, transparent 70%)`;
  }, [backgroundColorId, resolvedTheme, intensity]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {backgroundMode === "none" && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundColor: (() => {
              const color = backgroundColors.find((c) => c.id === backgroundColorId);
              const r = color?.rgb.r || 148;
              const g = color?.rgb.g || 158;
              const b = color?.rgb.b || 158;
              return `rgb(${r}, ${g}, ${b})`;
            })(),
            opacity: intensity * 0.3,
          }}
        />
      )}
      {backgroundMode === "gradient" && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: gradientPattern,
            filter: `blur(${blur}px)`,
          }}
        />
      )}
      {backgroundMode === "image" && backgroundImageUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: intensity,
            filter: `blur(${blur}px)`,
          }}
        />
      )}
    </div>
  );
}
