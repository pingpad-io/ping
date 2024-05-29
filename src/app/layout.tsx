import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "~/components/Providers";
import Menu from "~/components/layout/Menu";
import { Sidebar } from "~/components/layout/Sidebar";
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

          <div className="flex flex-row justify-center shrink grow w-full">
            <div className="hidden sm:flex sticky top-0 h-fit">
              <Menu />
            </div>

            <div className="min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl h-full">
              <div className="z-[100] flex sm:hidden h-fit w-full sticky top-0 bg-card rounded-b-lg drop-shadow-xl">
                <Menu />
              </div>
              {children}
            </div>

            <div className="hidden lg:flex sticky top-0 h-fit max-w-xs w-max">
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
