import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const Twotter: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <ClerkProvider appearance={{ baseTheme: shadesOfPurple }}>
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
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(Twotter);
