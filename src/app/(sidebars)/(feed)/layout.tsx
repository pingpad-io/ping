import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { Navigation } from "~/components/menu/Navigation";
import { Card } from "~/components/ui/card";

export const experimental_ppr = true;

export default function layout({ children }: PropsWithChildren) {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <ServerSignedIn>
        <Navigation />
      </ServerSignedIn>
      {children}
    </Card>
  );
}
