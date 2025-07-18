import { Metadata } from "next";
import { Suspense } from "react";
import { FeedSuspense } from "~/components/FeedSuspense";
import TrendingCommunitiesPage from "~/components/TrendingCommunitiesPage";

export const metadata: Metadata = {
  title: "Trending Communities",
  description: "Discover trending communities on Pingpad",
};

export default function TrendingPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<FeedSuspense />}>
        <TrendingCommunitiesPage />
      </Suspense>
    </div>
  );
}
