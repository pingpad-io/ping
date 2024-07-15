import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const getCookieAuth = (): { isValid: boolean; refreshToken: string | null } => {
  const storage = cookies();
  const refreshToken = storage.get("refreshToken")?.value;

  try {
    const decodedToken = jwtDecode(refreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      console.log(currentTimestamp, decodedToken.exp, decodedToken.exp < currentTimestamp);
      return {
        isValid: false,
        refreshToken: null,
      };
    }

    return {
      isValid: true,
      refreshToken,
    };
  } catch (error) {
    console.error("Error decoding jwt token:", error);
    return {
      isValid: false,
      refreshToken: null,
    };
  }
};
