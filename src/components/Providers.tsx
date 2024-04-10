"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import React from "react";
import { http } from "@wagmi/core";
import { localStorage } from "~/utils/localStorage";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { env } from "~/env.mjs";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const url = getBaseUrl();

const metadata = {
  name: "Pingpad",
  description: "minimalistic decentralized social",
  url,
  icons: ["https://pingpad.io/favicon.ico"],
};

const wagmiConfig = createConfig({
  chains: [polygonMumbai, polygon],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

const lensConfig: LensConfig = {
  bindings: bindings(wagmiConfig),
  environment: production, // or production
  storage: localStorage(),
};

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
