import { type User, lensProfileToUser } from "~/components/user/User";
import { getServerAuth } from "./getServerAuth";

export const getUserByHandle = async (handle: string): Promise<User | null> => {
  const { client } = await getServerAuth();

  const profile = await client.profile.fetch({
    forHandle: `lens/${handle}`,
  });

  if (!profile) return null;

  const user = lensProfileToUser(profile);

  return user;
};
