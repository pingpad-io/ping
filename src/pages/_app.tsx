import { type Session, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "~/components/ThemeProvider";
import { quicksand } from "~/styles/fonts";
import "~/styles/globals.css";
import { api } from "~/utils/api";

function Ping({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Head>
          <title>Ping</title>
          <meta name="description" content="reach Your people on Pingpad" />
          <link rel="icon" ref="/favicon.ico" />
        </Head>

        <main className={`flex flex-col scroll-smooth font-sans ${quicksand.variable}`}>
          <Component {...pageProps} />
        </main>

        <Analytics />
        <Toaster position="top-center" />
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(Ping);
