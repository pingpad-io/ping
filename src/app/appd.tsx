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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [polygonMumbai, polygon],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
});

import { IStorageProvider, LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";

const lensConfig: LensConfig = {
  bindings: bindings(wagmiConfig),
  environment: production,
};
import { LensProvider } from "@lens-protocol/react-web";

function Ping({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });
  console.log(lensConfig);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Head>
          <title>Pingpad</title>
          <meta name="description" content="reach Your people on Pingpad" />
          <link rel="icon" ref="/favicon.ico" />
        </Head>

        <main className={`flex flex-col scroll-smooth font-sans ${quicksand.variable}`}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <LensProvider config={lensConfig}>
                <Component {...pageProps} />
              </LensProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </main>

        <Analytics />
        <Toaster position="top-center" />
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(Ping);
