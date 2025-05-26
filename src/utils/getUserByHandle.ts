import { type User, lensAcountToUser } from "~/components/user/User";
import { getServerAuth } from "./getServerAuth";
import { fetchAccount } from "@lens-protocol/client/actions";

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const { client } = await getServerAuth();

  const profile = await fetchAccount(client, {
    username: {localName: username}
  }).unwrapOr(null);

  if (!profile) return null;

  const user = lensAcountToUser(profile);

  return user;
};
