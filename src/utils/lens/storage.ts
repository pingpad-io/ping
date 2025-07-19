import { StorageClient } from "@lens-chain/storage-client";
import { IStorageProvider } from "@lens-protocol/client";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const MAX_AGE = 30 * 24 * 60 * 60;

export const cookieStorage: IStorageProvider = {
  async getItem(key: string) {
    const { cookies } = await import("next/headers");
    const value = getCookie(key, { cookies });

    return value ?? null;
  },
  setItem(key: string, value: string) {
    setCookie(key, value, {
      maxAge: MAX_AGE,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  },

  removeItem(key: string) {
    deleteCookie(key, {
      maxAge: 0,
      path: "/",
    });
  },
};

export const clientCookieStorage: IStorageProvider = {
  async getItem(key: string) {
    const value = getCookie(key);

    return value ?? null;
  },
  setItem(key: string, value: string) {
    setCookie(key, value, {
      maxAge: MAX_AGE,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  },

  removeItem(key: string) {
    deleteCookie(key, {
      maxAge: 0,
      path: "/",
    });
  },
};

export const storageClient = StorageClient.create();
