import { SessionClient } from "@lens-protocol/client";
import { fetchMeDetails } from "@lens-protocol/client/actions";
import jwt from "jsonwebtoken";
import { type User, lensAcountToUser } from "~/components/user/User";
import { getLensClient } from "./lens/getLensClient";

interface ServerAuthResult {
  isAuthenticated: boolean;
  profileId: string | null;
  address: string | null;
  handle: string | null;
  client: SessionClient;
  user: User | null;
}

interface LensIdToken {
  sub: string; // signedBy address
  iss: string; // API endpoint
  aud: string; // App address
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  sid: string; // Session ID
  act?: string; // Optional account address for managers
  "tag:lens.dev,2024:sponsored"?: boolean;
  "tag:lens.dev,2024:role"?: "ACCOUNT_OWNER" | "ACCOUNT_MANAGER" | "ONBOARDING_USER" | "BUILDER";
}

export const getServerAuth = async (): Promise<ServerAuthResult> => {
  // const { refreshToken, isValid } = getCookieAuth();

  const client = await getLensClient();

  if (!client.isSessionClient()) {
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client: null,
    };
  }
  const credentials = await client.getCredentials();

  if (!credentials || credentials.isErr()) {
    throw new Error("Unable to get credentials");
  }

  const idToken = credentials.value?.idToken;
  const decodedIdToken = jwt.decode(idToken || "") as LensIdToken;
  if (!decodedIdToken) {
    throw new Error("Invalid ID token");
  }

  const address = decodedIdToken.sub;
  const account = await fetchMeDetails(client).unwrapOr(null);

  if (!account) {
    console.error("Profile not found, returning empty profile");
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client,
    };
  }

  const handle = account.loggedInAs.account.username?.localName;
  const user = lensAcountToUser(account);

  return {
    isAuthenticated: !!address,
    profileId: address,
    address,
    client,
    handle,
    user,
  };
};
