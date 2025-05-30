"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  const cookieStore = cookies();
  for (const cookie of cookieStore.getAll()) {
    cookieStore.delete(cookie.name);
  }
}
