"use client";

import { BackgroundThemeSettings } from "~/components/BackgroundThemeSettings";
import { ThemeButtons } from "~/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function ThemeSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <ThemeButtons />
          </div>
        </CardContent>
      </Card>

      <BackgroundThemeSettings />
    </div>
  );
}
