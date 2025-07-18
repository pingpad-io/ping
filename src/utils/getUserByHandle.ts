import { fetchAccount } from "@lens-protocol/client/actions";
import type { User } from "~/lib/types/user";
import { lensAccountToUser } from "~/utils/lens/converters/userConverter";
import { getServerAuth } from "./getServerAuth";

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const { client } = await getServerAuth();

  const profile = await fetchAccount(client, {
    username: { localName: username },
  }).unwrapOr(null);

  if (!profile) return null;

  const user = lensAccountToUser(profile);

  return user;
};
