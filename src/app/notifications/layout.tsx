import { BellIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Card } from "~/components/ui/card";

export default function layout({ children }: PropsWithChildren) {
  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <h1 className="text-xl font-bold p-4 flex flex-row gap-2 items-center">
        <BellIcon className="-mb-1" fill="hsl(var(--foreground))" /> notifications
      </h1>
      {children}
    </Card>
  );
}
