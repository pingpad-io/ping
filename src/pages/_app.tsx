import {
	createBrowserSupabaseClient,
	type Session,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { type AppProps } from "next/app";
import { Raleway } from "next/font/google";
import Head from "next/head";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "~/components/ThemeProvider";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const raleway = Raleway({
	weight: ["300", "500", "700", "800"],
	preload: true,
	subsets: ["latin-ext"],
	variable: "--font-raleway",
});

function Ping({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<Head>
				<title>Ping</title>
				<meta name="description" content="reach your people on Ping" />
				<link rel="icon" ref="/favicon.ico" />
			</Head>
			<Analytics />
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<Toaster position="top-center" />
				<main
					className={`flex min-h-screen flex-row place-content-center text-base-content font-sans ${raleway.variable}`}
				>
					<Component {...pageProps} />
				</main>
			</ThemeProvider>
		</SessionContextProvider>
	);
}

export default api.withTRPC(Ping);
