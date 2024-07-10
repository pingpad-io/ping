"use client";

import { useRefreshToken, useSession } from "@lens-protocol/react-web";
import { setCookie } from "cookies-next";
import { useEffect } from "react";

export default function AuthWatcher() {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const handleRefresh = async () => {
      if (session?.authenticated) {
        const currentRefreshToken = JSON.parse(localStorage.getItem("lens.production.credentials"))?.data?.refreshToken;
        if (refreshToken && currentRefreshToken !== refreshToken) {
          setCookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "lax",
          });
          console.log("Updated auth credentials");
        }
      }
    };

    handleRefresh();
  }, [session]);

  return null; // This component doesn't render anything
}
