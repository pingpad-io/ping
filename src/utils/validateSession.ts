import type { SessionClient } from "@lens-protocol/client";
import { fetchMeDetails } from "@lens-protocol/client/actions";
import type { User } from "~/lib/types/user";
import { lensAccountToUser } from "~/utils/lens/converters/userConverter";
import { getLensClient } from "./lens/getLensClient";
import { getCookieAuth } from "./getCookieAuth";

interface SessionValidationResult {
  isAuthenticated: boolean;
  user: User | null;
  sessionClient: SessionClient | null;
  address: string | null;
  handle: string | null;
}

export const validateSession = async (): Promise<SessionValidationResult> => {
  const unauthenticatedResult: SessionValidationResult = {
    isAuthenticated: false,
    user: null,
    sessionClient: null,
    address: null,
    handle: null,
  };

  const { isValid } = getCookieAuth();
  if (!isValid) {
    return unauthenticatedResult;
  }

  try {
    const client = await getLensClient();
    
    if (!client.isSessionClient()) {
      return unauthenticatedResult;
    }

    const sessionClient = client as SessionClient;
    const authenticatedUser = sessionClient.getAuthenticatedUser();

    if (authenticatedUser.isErr() || !authenticatedUser.value) {
      return unauthenticatedResult;
    }

    const account = await fetchMeDetails(sessionClient);

    if (account.isErr()) {
      return unauthenticatedResult;
    }

    const address = authenticatedUser.value.address;
    const handle = account.value.loggedInAs.account.username?.localName || null;
    const user = lensAccountToUser(account.value.loggedInAs.account);

    const result: SessionValidationResult = {
      isAuthenticated: true,
      user,
      sessionClient,
      address,
      handle,
    };

    return result;
  } catch (error) {
    console.error("Session validation error:", error);
    return unauthenticatedResult;
  }
};