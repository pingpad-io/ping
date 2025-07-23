import type { Metadata } from "next";
import NewLandingPage from "~/components/landing/NewLandingPage";

export const metadata: Metadata = {
  title: "Pingpad",
  description: "reach your people on pingpad",
  openGraph: {
    title: "Pingpad",
    description: "reach your people on pingpad",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const LandingPage = () => {
  return (
    <NewLandingPage />
  );
};

export default LandingPage;
