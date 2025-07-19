import { AnyClient, SessionClient } from "@lens-protocol/client";
import type { User } from "~/lib/types/user";
import { getLensClient } from "./lens/getLensClient";
import { validateSession } from "./validateSession";

interface ServerAuthResult {
  isAuthenticated: boolean;
  profileId: string | null;
  address: string | null;
  handle: string | null;
  client: AnyClient;
  sessionClient: SessionClient | null;
  user: User | null;
}

export const getServerAuth = async (): Promise<ServerAuthResult> => {
  const client = await getLensClient();
  const session = await validateSession();

  return {
    isAuthenticated: session.isAuthenticated,
    profileId: session.address,
    address: session.address,
    handle: session.handle,
    client,
    sessionClient: session.sessionClient,
    user: session.user,
  };
};
