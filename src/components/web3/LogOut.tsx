"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  const storage = cookies();

  storage.delete("profileId");
  storage.delete("refreshToken");
  storage.delete("accessToken");
  storage.delete("handle");
}
