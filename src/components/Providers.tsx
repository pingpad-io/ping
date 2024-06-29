"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { type LensConfig, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { env } from "~/env.mjs";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { localStorage } from "~/utils/localStorage";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const url = getBaseUrl();

const metadata = {
  name: "Pingpad",
  description: "minimalistic decentralized social",
  url,
  icons: ["https://pingpad.io/favicon.ico"],
};

const wagmiConfig = createConfig({
  chains: [polygon],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata,
      qrModalOptions: {
        themeMode: "dark",
        themeVariables: {
          "--wcm-font-family": "Quicksand, sans-serif",
          "--wcm-background-border-radius": "8px",
          "--wcm-container-border-radius": "8px",
          "--wcm-button-border-radius": "6px",
          "--wcm-button-hover-highlight-border-radius": "6px",
          "--wcm-icon-button-border-radius": "6px",
          "--wcm-background-color": "hsl(var(--popover))",
          "--wcm-accent-color": "rgb(148,158,158)",
          "--wcm-accent-fill-color": "hsl(var(--card-foreground))",
        },
        explorerRecommendedWalletIds: [
          // Coinbase Wallet ID https://walletconnect.com/explorer/coinbase-wallet
          "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
          // Trust Wallet ID https://walletconnect.com/explorer/trust-wallet
          "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
          // Ledger Live ID https://walletconnect.com/explorer/ledger-live
          "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
        ],
      },
    }),
  ],
  transports: {
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

const lensConfig: LensConfig = {
  bindings: bindings(wagmiConfig),
  environment: production,
  storage: localStorage(),
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <LensProvider config={lensConfig}>{children}</LensProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
