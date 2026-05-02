import type { Metadata } from "next";
import type { ReactNode } from "react";
import "~/styles/globals.css";
import "fumadocs-ui/style.css";
import { quicksand } from "~/styles/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://paper.flow.industries"),
  title: {
    default: "Paper Docs",
    template: "%s | Paper Docs",
  },
  description: "Paper Documentation",
};

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${quicksand.variable} scroll-smooth font-sans`} lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
