import { Suspense } from "react";
import { FeedSuspense } from "~/components/Feed";
import { SearchPage } from "./SearchPage";

const search = async () => {
  return (
    <Suspense fallback={<FeedSuspense />}>
      <SearchPage />
    </Suspense>
  );
};

export default search;
