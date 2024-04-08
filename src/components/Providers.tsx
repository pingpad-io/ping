"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import React from "react";
import { http } from "@wagmi/core";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { localStorage } from "~/utils/localStorage";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "Pingpad",
  description: "minimalistic decentralized social",
  url: "https://pingpad.io",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  metadata,
  projectId,
  chains: [polygonMumbai, polygon],
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

const w3m = createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  defaultChain: polygon,
  enableWalletFeatures: true,
  allWallets: "SHOW",
  themeMode: "dark",
  themeVariables: {
    "--w3m-border-radius-master": "2px",
    "--w3m-font-family": "Quicksand, sans-serif",
  },
});

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
