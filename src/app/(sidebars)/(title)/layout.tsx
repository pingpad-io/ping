import type { PropsWithChildren } from "react";
import { RouteTitle } from "~/components/RouteTitle";
import { Card } from "~/components/ui/card";

export default function layout({ children }: PropsWithChildren) {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <RouteTitle />
      {children}
    </Card>
  );
}
