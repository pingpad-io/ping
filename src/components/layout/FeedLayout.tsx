import { type PropsWithChildren, Suspense } from "react";
import { Feed } from "../Feed";
import { ServerSignedIn } from "../ServerSignedIn";
import { Card } from "../ui/card";
import { Navigation } from "./Navigation";

export const FeedPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <ServerSignedIn>
        <Navigation />
      </ServerSignedIn>
      <Suspense fallback={<Feed />}>{children}</Suspense>
    </Card>
  );
};
