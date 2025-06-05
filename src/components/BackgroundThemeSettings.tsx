"use client";

import { useBackgroundTheme, type BackgroundTheme } from "~/hooks/useBackgroundTheme";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemePreviewProps {
  theme: BackgroundTheme;
  isSelected: boolean;
  onSelect: () => void;
  isDarkMode: boolean;
}

function ThemePreview({ theme, isSelected, onSelect, isDarkMode }: ThemePreviewProps) {
  const gradient = isDarkMode ? theme.darkGradient : theme.lightGradient;
  
  return (
    <button
      onClick={onSelect}
      className={`relative w-20 h-16 rounded-lg border-2 transition-all hover:scale-105 ${
        isSelected ? "border-primary" : "border-border"
      }`}
      style={{
        background: gradient,
        backgroundColor: isDarkMode ? "hsl(var(--background))" : "hsl(var(--background))"
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
  const { backgroundThemeId, setBackgroundThemeId, availableThemes, mounted } = useBackgroundTheme();
  const { theme } = useTheme();
  
  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === "dark";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Themes</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a subtle gradient background for your app
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {availableThemes.map((themeOption) => (
            <ThemePreview
              key={themeOption.id}
              theme={themeOption}
              isSelected={backgroundThemeId === themeOption.id}
              onSelect={() => setBackgroundThemeId(themeOption.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Background themes automatically adapt to your light/dark mode preference. 
            Gradients are designed to be subtle and won't interfere with content readability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}