import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "../ServerSignedIn";
import { Card } from "../ui/card";
import { Navigation } from "./Navigation";

export async function FeedLayout({ children }: PropsWithChildren) {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <ServerSignedIn>
        <Navigation />
      </ServerSignedIn>
      {children}
    </Card>
  );
}
