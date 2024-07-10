"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  const storage = cookies();

  storage.delete("refreshToken");
}
