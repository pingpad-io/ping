import { cookies } from "next/headers";

export const getCookieAuth = () => {
  const storage = cookies();

  const refreshToken = storage.get("refreshToken")?.value;
  const isAuthenticated = refreshToken;

  return {
    isAuthenticated,
    refreshToken,
  };
};
