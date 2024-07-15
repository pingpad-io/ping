import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { isValid } from "zod";

export const getCookieAuth = (): { isValid: boolean; refreshToken: string | null } => {
  const storage = cookies();
  const refreshToken = storage.get("refreshToken")?.value;

  try {
    const decodedToken = jwtDecode(refreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (typeof decodedToken !== "object" || !("exp" in decodedToken)) {
      throw new Error("Invalid token structure");
    }

    if (typeof decodedToken.exp !== "number" || decodedToken.exp < currentTimestamp) {
      console.log(false);
      return {
        isValid: false,
        refreshToken: null,
      };
    }

    console.log(true);
    return {
      isValid: true,
      refreshToken,
    };
  } catch (error) {
    console.log("Error decoding jwt token:", error);
    console.log(false);
    return {
      isValid: false,
      refreshToken: null,
    };
  }
};
