"use client";

import { useSessionClient } from "@lens-protocol/react";

export default function AuthWatcher() {
  const { data: session } = useSessionClient();
  // const refreshToken = session?.unwrapOr(null)?.getCredentials().refreshToken;
  // const currentRefreshToken = getCookie("refreshToken");

  // useEffect(() => {
  //   const handleRefresh = async () => {
  //     if (session?.isSessionClient()) {
  //       if (refreshToken && currentRefreshToken !== refreshToken) {
  //         setCookie("refreshToken", refreshToken, {
  //           secure: true,
  //           sameSite: "lax",
  //         });
  //       }
  //     }
  //   };

  //   handleRefresh();
  // }, [session]);

  return null;
}
