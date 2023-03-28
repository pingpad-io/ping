import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="top-left" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
