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

const sessionCache = new Map<string, SessionValidationResult>();

export const validateSession = async (): Promise<SessionValidationResult> => {
  const cacheKey = "current_session";
  
  const cached = sessionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const unauthenticatedResult: SessionValidationResult = {
    isAuthenticated: false,
    user: null,
    sessionClient: null,
    address: null,
    handle: null,
  };

  const { isValid } = getCookieAuth();
  if (!isValid) {
    sessionCache.set(cacheKey, unauthenticatedResult);
    return unauthenticatedResult;
  }

  try {
    const client = await getLensClient();
    
    if (!client.isSessionClient()) {
      sessionCache.set(cacheKey, unauthenticatedResult);
      return unauthenticatedResult;
    }

    const sessionClient = client as SessionClient;
    const authenticatedUser = await sessionClient.getAuthenticatedUser();

    if (authenticatedUser.isErr() || !authenticatedUser.value) {
      sessionCache.set(cacheKey, unauthenticatedResult);
      return unauthenticatedResult;
    }

    const account = await fetchMeDetails(sessionClient);

    if (account.isErr()) {
      sessionCache.set(cacheKey, unauthenticatedResult);
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

    sessionCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Session validation error:", error);
    sessionCache.set(cacheKey, unauthenticatedResult);
    return unauthenticatedResult;
  }
};

export const clearSessionCache = () => {
  sessionCache.clear();
};