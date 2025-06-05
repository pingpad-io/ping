"use client";

import { CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { type BackgroundTheme, useBackgroundTheme } from "~/hooks/useBackgroundTheme";

interface ThemePreviewProps {
  theme: BackgroundTheme;
  isSelected: boolean;
  onSelect: () => void;
  isDarkMode: boolean;
}

function ThemePreview({ theme, isSelected, onSelect, isDarkMode }: ThemePreviewProps) {
  const colors = isDarkMode ? theme.darkColors : theme.lightColors;
  const gradient = `radial-gradient(ellipse at top, ${colors.color1} 0%, transparent 50%), radial-gradient(ellipse at bottom right, ${colors.color2} 0%, transparent 50%), radial-gradient(ellipse at center left, ${colors.color3} 0%, transparent 50%)`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-24 h-20 rounded-lg border-2 transition-all hover:scale-105 ${
        isSelected ? "border-primary" : "border-border"
      }`}
      style={{
        background: gradient,
        backgroundColor: isDarkMode ? "hsl(var(--background))" : "hsl(var(--background))",
      }}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <CheckIcon size={12} />
          </div>
        </div>
      )}
      <div className="absolute bottom-1 left-1 right-1">
        <div className="text-xs font-medium bg-background/80 backdrop-blur-sm rounded px-1 py-0.5 text-center">
          {theme.name}
        </div>
      </div>
    </button>
  );
}

export function BackgroundThemeSettings() {
  const { backgroundThemeId, setBackgroundThemeId, availableThemes, intensity, setIntensity, mounted } =
    useBackgroundTheme();
  const { theme } = useTheme();

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === "dark";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Themes</CardTitle>
        <p className="text-sm text-muted-foreground">Choose a subtle gradient background for your app</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="grid grid-cols-3 gap-3">
            {/* No gradient option */}
            <button
              type="button"
              onClick={() => setIntensity(0)}
              className={`relative w-24 h-20 rounded-lg border-2 transition-all hover:scale-105 ${
                intensity === 0 ? "border-primary" : "border-border"
              }`}
              style={{
                backgroundColor: isDarkMode ? "hsl(var(--background))" : "hsl(var(--background))",
              }}
            >
              {intensity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <CheckIcon size={12} />
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1">
                <div className="text-xs font-medium bg-background/80 backdrop-blur-sm rounded px-1 py-0.5 text-center">
                  None
                </div>
              </div>
            </button>

            {/* Theme options */}
            {availableThemes.map((themeOption) => (
              <ThemePreview
                key={themeOption.id}
                theme={themeOption}
                isSelected={backgroundThemeId === themeOption.id && intensity > 0}
                onSelect={() => {
                  console.log("Theme selected:", themeOption.id);
                  setBackgroundThemeId(themeOption.id);
                  if (intensity === 0) {
                    setIntensity(0.15); // Default intensity when selecting a theme (50% of max)
                  }
                }}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        {/* Intensity slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Intensity</span>
            <span className="text-sm text-muted-foreground">{Math.round((intensity / 0.3) * 100)}%</span>
          </div>
          <Slider
            value={[intensity]}
            onValueChange={([value]) => setIntensity(value)}
            min={0}
            max={0.3}
            step={0.01}
            className="w-full"
            aria-label="Background gradient intensity"
          />
        </div>
      </CardContent>
    </Card>
  );
}
