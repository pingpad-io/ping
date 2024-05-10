import { PropsWithChildren } from "react";
import { Navigation } from "./menu/Navigation";
import { Card } from "./ui/card";

export const FeedPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <Card className="z-[30] hover:bg-card p-4 pt-0 border-0">
      <Navigation />
      {children}
    </Card>
  );
};
