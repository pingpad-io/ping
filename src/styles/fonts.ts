import { Raleway } from "next/font/google";
export const raleway = Raleway({
  weight: ["300", "500", "700", "800"],
  preload: true,
  subsets: ["latin-ext"],
  variable: "--font-raleway",
});