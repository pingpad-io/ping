"use client";

import { chains } from "@lens-chain/sdk/viem";
import { LensProvider, PublicClient, mainnet } from "@lens-protocol/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { familyAccountsConnector } from "family";
import { ThemeProvider } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { createClient } from "viem";
import { http, WagmiProvider, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { env } from "~/env.mjs";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { wagmiLocalStorage } from "~/utils/localStorage";
import { ExplosionProvider } from "./ExplosionPortal";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const url = getBaseUrl();

// const config = createConfig(getDefaultConfig({
//   appName: "Pingpad",
//   appDescription: "minimalistic decentralized social",
//   appUrl: url,
//   walletConnectProjectId: projectId,
//   connectors: [
//     injected(),
//     walletConnect({
//       projectId,
//       metadata: {
//         name: "Pingpad",
//         description: "minimalistic decentralized social",
//         url,
//         icons: ["https://pingpad.io/favicon.ico"],
//       },
//       qrModalOptions: {
//         themeMode: "dark",
//         themeVariables: {
//           "--wcm-font-family": "Quicksand, sans-serif",
//           "--wcm-background-border-radius": "8px",
//           "--wcm-container-border-radius": "8px",
//           "--wcm-button-border-radius": "6px",
//           "--wcm-button-hover-highlight-border-radius": "6px",
//           "--wcm-icon-button-border-radius": "6px",
//           "--wcm-background-color": "hsl(var(--popover))",
//           "--wcm-accent-color": "rgb(148,158,158)",
//           "--wcm-accent-fill-color": "hsl(var(--card-foreground))",
//         },
//         explorerRecommendedWalletIds: [
//           // Coinbase Wallet ID https://walletconnect.com/explorer/coinbase-wallet
//           "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
//           // Trust Wallet ID https://walletconnect.com/explorer/trust-wallet
//           "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
//           // Ledger Live ID https://walletconnect.com/explorer/ledger-live
//           "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
//         ],
//       },
//     }),
//   ],

//   storage: createStorage({
//     storage: wagmiLocalStorage(),
//     key: "wagmi",
//   }),
// });
const wagmiConfig = createConfig({
  chains: [chains.mainnet],
  transports: {
    [chains.mainnet.id]: http(),
    [chains.testnet.id]: http(),
  },
  connectors: [
    familyAccountsConnector(),
    injected(),
    walletConnect({
      projectId: projectId,
      metadata: {
        name: "Pingpad",
        description: "minimalistic decentralized social",
        url: url,
        icons: ["https://pingpad.io/favicon.ico"],
      },

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
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const publicClient = PublicClient.create({
    environment: mainnet,
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <LensProvider client={publicClient}>
              <ExplosionProvider>
                <OverlayScrollbarsComponent defer className="h-full">
                  {children}
                </OverlayScrollbarsComponent>
              </ExplosionProvider>
            </LensProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
