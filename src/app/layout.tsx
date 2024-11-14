import dynamic from "next/dynamic";
import Script from "next/script";
import { Providers } from "~/components/Providers";
import { Toaster } from "~/components/ui/sonner";
import { UserProvider } from "~/components/user/UserContext";
import { quicksand } from "~/styles/fonts";
import { getServerAuth } from "~/utils/getServerAuth";
import "../styles/globals.css";

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
        <Script defer src="https://stats.pingpad.io/script.js" data-website-id="b3bf05cd-46cc-4199-a5c0-aeaf3d70d311" />
      </head>
      <body className="flex flex-col relative">
        <Providers>
          <UserProvider user={user}>
            <AuthWatcher />
            <Toaster position="top-right" offset={16} />

            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
