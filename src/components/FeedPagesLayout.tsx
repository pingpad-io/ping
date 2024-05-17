import type { PropsWithChildren } from "react";
import { SignedIn } from "./Authenticated";
import { Navigation } from "./menu/Navigation";
import { Card } from "./ui/card";

export const FeedPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <SignedIn>
        <Navigation />
      </SignedIn>
      {children}
    </Card>
  );
};
