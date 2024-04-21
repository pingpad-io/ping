"use client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Menu from "~/components/Menu";
import { Sidebar } from "~/components/Sidebar";
import { quicksand } from "~/styles/fonts";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const Providers = dynamic(() => import("../components/Providers"), { ssr: false });

// export const metadata = {
//   title: "Pingpad",
//   description: "reach your people on pingpad",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FIXME: this should be rendered on the server. temporary hotfix with client rendering
  const pathname = usePathname();
  if (pathname === "/") {
    return (
      <html className={`${quicksand.variable} scroll-smooth font-sans`} lang="en">
        <body className="flex flex-col">
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }
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
