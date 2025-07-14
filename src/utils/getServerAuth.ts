import { AnyClient, SessionClient } from "@lens-protocol/client";
import { fetchMeDetails } from "@lens-protocol/client/actions";
import jwt from "jsonwebtoken";
import { lensAccountToUser, type User } from "~/components/user/User";
import { getLensClient } from "./lens/getLensClient";

interface ServerAuthResult {
  isAuthenticated: boolean;
  profileId: string | null;
  address: string | null;
  handle: string | null;
  client: AnyClient;
  sessionClient: SessionClient | null;
  user: User | null;
}

interface LensIdToken {
  sub: string; // signedBy address
  iss: string; // API endpoint
  aud: string; // App address
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  sid: string; // Session ID
  act?: {
    sub: string;
  };
  "tag:lens.dev,2024:sponsored"?: boolean;
  "tag:lens.dev,2024:role"?: "ACCOUNT_OWNER" | "ACCOUNT_MANAGER" | "ONBOARDING_USER" | "BUILDER";
}

export const getServerAuth = async (): Promise<ServerAuthResult> => {
  // const { refreshToken, isValid } = getCookieAuth();

  const client = await getLensClient();
  let sessionClient: SessionClient | null = null;

  if (!client.isSessionClient()) {
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client,
      sessionClient: null,
    };
  }

  sessionClient = client as SessionClient;
  const credentials = await sessionClient.getCredentials();

  if (!credentials || credentials.isErr()) {
    throw new Error("Unable to get credentials");
  }

  const idToken = credentials.value?.idToken;
  const decodedIdToken = jwt.decode(idToken || "") as LensIdToken;
  if (!decodedIdToken) {
    throw new Error("Invalid ID token");
  }

  const address = decodedIdToken.act?.sub || decodedIdToken.sub;
  const authenticatedUser = await sessionClient.getAuthenticatedUser();

  if (authenticatedUser.isErr() || !authenticatedUser.value) {
    console.error("Profile not found, returning empty profile");
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client,
      sessionClient: null,
    };
  }

  const account = await fetchMeDetails(sessionClient);

  if (account.isErr()) {
    console.error("Profile not found, returning empty profile");
    return {
      isAuthenticated: false,
      profileId: null,
      address: null,
      handle: null,
      user: null,
      client,
      sessionClient: null,
    };
  }

  const handle = account.value.loggedInAs.account.username?.localName;
  const user = lensAccountToUser(account.value.loggedInAs.account);

  return {
    isAuthenticated: !!address,
    profileId: address,
    address,
    client,
    sessionClient,
    handle,
    user,
  };
};
