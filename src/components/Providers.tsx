"use client";

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
import { api } from "~/utils/api";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

import { IStorageProvider, LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [polygonMumbai, polygon],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
});

const lensConfig: LensConfig = {
  bindings: bindings(wagmiConfig),
  environment: production,
};
import { LensProvider } from "@lens-protocol/react-web";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <LensProvider config={lensConfig}>{children}</LensProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
