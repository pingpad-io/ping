import { Suspense } from "react";
import { SuspenseView } from "~/components/post/SuspenseView";
import { SearchPage } from "./SearchPage";

const search = async () => {
  const suspense = [...Array(12)].map((_v, idx) => <SuspenseView key={`suspense-${idx}`} />);

  return (
    <Suspense fallback={suspense}>
      <SearchPage />
    </Suspense>
  );
};

export default search;
