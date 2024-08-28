"use client";

import { useRefreshToken, useSession } from "@lens-protocol/react-web";
import { setCookie } from "cookies-next";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export default function AuthWatcher() {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  const currentRefreshToken = getCookie("refreshToken");

  useEffect(() => {
    const handleRefresh = async () => {
      if (session?.authenticated) {
        if (refreshToken && currentRefreshToken !== refreshToken) {
          setCookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "lax",
          });
        }
      }
    };

    handleRefresh();
  }, [session]);

  return null; 
}
