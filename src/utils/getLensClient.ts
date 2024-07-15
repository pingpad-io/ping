import { LensClient, production } from "@lens-protocol/client";
import { lensProfileToUser } from "~/components/user/User";
import { getCookieAuth } from "./getCookieAuth";
import { window } from "./globals";

export const getLensClient = async () => {
  const { refreshToken, isValid } = getCookieAuth();

  const client = new LensClient({
    environment: production,
    headers: {
      origin: "https://pingpad.io",
    },
    storage: window?.localStorage,
  });

  if (!refreshToken || !isValid) {
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client,
    };
  }

  if (refreshToken && isValid) {
    await client.authentication.authenticateWith({ refreshToken });
  }

  const profileId = await client.authentication.getProfileId();
  const address = await client.authentication.getWalletAddress();

  const user = await client.profile
    .fetch({ forProfileId: profileId })
    .catch(() => null)
    .then((profile) => lensProfileToUser(profile));

  const handle = user?.handle;

  return {
    isAuthenticated: !!profileId,
    profileId,
    address,
    client,
    handle,
    user,
  };
};
