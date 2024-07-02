import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedSuspense } from "~/components/FeedSuspense";
import { Search } from "../../../components/Search";

export async function generateMetadata({ searchParams }: { searchParams: { q: string } }): Promise<Metadata> {
  const query = searchParams.q;

  const title = `Searching for ${query}`;
  return {
    title,
    description: `@${query} on Pingpad`,
  };
}
const search = async () => {
  return (
    <Suspense fallback={<FeedSuspense />}>
      <Search />
    </Suspense>
  );
};

export default search;
