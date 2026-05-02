import type { Metadata } from "next";
import { LandingContent } from "~/components/LandingContent";
import { generateDefaultOGUrl } from "~/utils/generateOGUrl";

const ogImageURL = generateDefaultOGUrl();

export const metadata: Metadata = {
  title: "Paper",
  description: "Permanent. Permissionless. Paper.",
  openGraph: {
    title: "Paper",
    description: "Permanent. Permissionless. Paper.",
    images: [ogImageURL],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper",
    description: "Permanent. Permissionless. Paper.",
    images: [ogImageURL],
  },
};

export default function LandingPage() {
  return <LandingContent />;
}
