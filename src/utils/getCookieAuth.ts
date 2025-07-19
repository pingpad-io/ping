import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface LensCredentials {
  data: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  };
}

export const getCookieAuth = (): { isValid: boolean; refreshToken: string | null } => {
  const storage = cookies();
  const lensCredentials = storage.get("lens.mainnet.credentials")?.value;

  if (!lensCredentials) {
    return {
      isValid: false,
      refreshToken: null,
    };
  }

  try {
    const credentials: LensCredentials = JSON.parse(lensCredentials);
    const refreshToken = credentials.data.refreshToken;

    if (!refreshToken) {
      return {
        isValid: false,
        refreshToken: null,
      };
    }

    const decodedToken = jwtDecode(refreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (typeof decodedToken !== "object" || !("exp" in decodedToken)) {
      throw new Error("Invalid token structure");
    }

    if (typeof decodedToken.exp !== "number" || decodedToken.exp < currentTimestamp) {
      throw new Error("Authentication token has expired");
    }

    return {
      isValid: true,
      refreshToken,
    };
  } catch (error) {
    console.log("Error validating credentials:", error);
    return {
      isValid: false,
      refreshToken: null,
    };
  }
};
