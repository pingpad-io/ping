"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  const cookieStore = cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}
