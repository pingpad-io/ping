import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import Menu from "~/components/Menu";
import Providers from "~/components/Providers";
import { Sidebar } from "~/components/Sidebar";
import { quicksand } from "~/styles/fonts";
import "../styles/globals.css";

export const metadata = {
  title: "Pingpad",
  description: "reach your people on pingpad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${quicksand.variable} scroll-smooth font-sans`} lang="en">
      <body className="flex flex-col">
        <SpeedInsights />
        <Analytics />
        <Toaster />

        <Providers>
          <div className="flex flex-row justify-center shrink grow w-full shrink">
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
