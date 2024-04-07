"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import React from "react";
import { http } from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const wagmiConfig = createConfig({
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
};

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const w3m = createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
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
