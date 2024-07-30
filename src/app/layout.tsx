import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { Providers } from "~/components/Providers";
import { Toaster } from "~/components/ui/sonner";
import { UserProvider } from "~/components/user/UserContext";
import { quicksand } from "~/styles/fonts";
import { getServerAuth } from "~/utils/getServerAuth";
import "../styles/globals.css";
import Script from "next/script";

const AuthWatcher = dynamic(() => import("~/components/auth/AuthWatcher"), { ssr: false });

export const metadata = {
  title: {
    default: "Pingpad",
    template: "%s | Pingpad",
  },
  description: "reach your people on pingpad",
};

export const maxDuration = 60;

export default async function RootLayout({ children }) {
  const { user } = await getServerAuth();

  return (
    <html className={`${quicksand.variable} scroll-smooth font-sans overflow-x-hidden overflow-y-scroll`} lang="en">
      <head>
        <Script defer src="https://stats.pingpad.io/script.js" data-website-id="3a604368-ddf7-40a8-a759-05bbe71ce01d"/>
      </head>
      <body className="flex flex-col relative">
        <Providers>
          <UserProvider user={user}>
            <SpeedInsights />
            <AuthWatcher />
            <Toaster position="top-right" offset={16} />

            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
