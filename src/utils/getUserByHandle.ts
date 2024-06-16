import { lensProfileToUser } from "~/components/user/User";
import { getLensClient } from "./getLensClient";

export const getUserByHandle = async (handle: string) => {
  const { client } = await getLensClient();

  const profile = await client.profile.fetch({
    forHandle: `lens/${handle}`,
  });

  const user = lensProfileToUser(profile);
  if (!user) throw new Error("∑(O_O;) Profile not found");

  return user;
}