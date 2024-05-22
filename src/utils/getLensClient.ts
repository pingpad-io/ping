import { LensClient, production } from "@lens-protocol/client";
import { getCookieAuth } from "./getCookieAuth";

export const getLensClient = async () => {
  const { refreshToken } = getCookieAuth();
  const client = new LensClient({
    environment: production,
  });

  if (refreshToken) {
    await client.authentication.authenticateWith({ refreshToken });
  }

  const isAuthenticated = await client.authentication.isAuthenticated();
  const profileId = await client.authentication.getProfileId();
  const address = await client.authentication.getWalletAddress();

  const profile = await client.profile
    .fetch({ forProfileId: profileId })
    .catch(() => null)
    .then((profile) => profile);
  const handle = profile.handle.localName;

  return {
    isAuthenticated,
    profileId,
    address,
    client,
    handle,
  };
};
