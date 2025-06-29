"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast backdrop-blur-sm bg-secondary/90 group-[.toaster]:text-foreground group-[.toaster]:shadow-sm rounded-2xl p-3 px-4",
          description: "group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground !rounded-lg",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground !rounded-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground !rounded-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
