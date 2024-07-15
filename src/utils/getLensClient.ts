import { LensClient, production } from "@lens-protocol/client";
import { User, lensProfileToUser } from "~/components/user/User";
import { getCookieAuth } from "./getCookieAuth";

interface ServerAuthResult {
  isAuthenticated: boolean;
  profileId: string | null;
  address: string | null;
  handle: string | null;
  client: LensClient;
  user: User | null;
};

export const getServerAuth = async (): Promise<ServerAuthResult> => {
  const { refreshToken, isValid } = getCookieAuth();

  const client = new LensClient({
    environment: production,
    headers: {
      origin: "https://pingpad.io",
    },
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
