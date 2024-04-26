import { cookies } from "next/headers";

export const getCookieAuth = () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const profileId = cookieStore.get("profileId")?.value;
  const handle = cookieStore.get("handle")?.value;

  if (!refreshToken) throw new Error("Unauthenticated");

  return {
    refreshToken,
    profileId,
    handle,
  };
};