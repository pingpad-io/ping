"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export const ThemeButtons = () => {
  const { setTheme } = useTheme();
  const buttons = ["light", "dark"].map((theme) => {
    return (
      <Button
        data-theme={theme}
        type="submit"
        key={theme}
        variant={"secondary"}
        size="sm_icon"
        onClick={() => setTheme(theme)}
      >
        {theme === "dark" ? <MoonIcon size={20} className="sm:mr-2" /> : <SunIcon size={20} className="sm:mr-2" />}
        <div className="hidden sm:flex text-base">{theme}</div>
      </Button>
    );
  });

  return buttons;
};
