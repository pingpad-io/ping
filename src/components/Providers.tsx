"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { LensConfig, production } from "@lens-protocol/react-web";
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
