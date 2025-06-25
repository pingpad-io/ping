import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "",
});

export interface PhotoCredits {
  id: string;
  username: string;
  name: string;
  portfolioUrl?: string;
  photoUrl: string;
}
