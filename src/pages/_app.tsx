import {
  Session,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { store } from "../utils/store";

function Twotter({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <Provider store={store}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider>
          <Head>
            <title>Twotter</title>
            <meta name="description" content="an anonymised twitter" />
            <link rel="icon" ref="/favicon.ico" />
          </Head>

          <Toaster position="top-center" />

          <Analytics />

          <main className="flex min-h-screen flex-row place-content-center text-base-content">
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </SessionContextProvider>
    </Provider>
  );
}

export default api.withTRPC(Twotter);
