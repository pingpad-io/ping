import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "~/components/Providers";
import { quicksand } from "~/styles/fonts";
import "../styles/globals.css";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: {
    default: "Pingpad",
    template: "%s | Pingpad",
  },
  description: "reach your people on pingpad",
};

export const maxDuration = 60;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${quicksand.variable} scroll-smooth font-sans overflow-y-scroll`} lang="en">
      <body className="flex flex-col relative">
        <Providers>
          <SpeedInsights />
          <Analytics />
          <Toaster position="top-right" offset={16} />

          {children}
        </Providers>
      </body>
    </html>
  );
}
