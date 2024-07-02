import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { quicksand } from "~/styles/fonts";
import "../styles/globals.css";
import { Providers } from "~/components/Providers";
import { Toaster } from "~/components/ui/sonner";
import { UserProvider } from "~/components/user/UserContext";
import { getLensClient } from "~/utils/getLensClient";

export const metadata = {
  title: {
    default: "Pingpad",
    template: "%s | Pingpad",
  },
  description: "reach your people on pingpad",
};

export const maxDuration = 60;

export default async function RootLayout({ children }) {
  const { user } = await getLensClient();

  return (
    <html className={`${quicksand.variable} scroll-smooth font-sans overflow-y-scroll`} lang="en">
      <body className="flex flex-col relative">
        <Providers>
          <UserProvider user={user}>
            <SpeedInsights />
            <Analytics />
            <Toaster position="top-right" offset={16} />

            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
