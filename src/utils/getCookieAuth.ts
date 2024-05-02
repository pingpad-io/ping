import { cookies } from "next/headers";

export const getCookieAuth = () => {
  const storage = cookies();

  const refreshToken = storage.get("refreshToken")?.value;
  const profileId = storage.get("profileId")?.value;
  const handle = storage.get("handle")?.value;

  return {
    refreshToken,
    profileId,
    handle,
  };
};
