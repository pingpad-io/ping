import { Card } from "~/components/ui/card";

export default function loading() {
  return (
    <Card className="z-[30] flex items-center gap-4 border-0 p-4 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <div className="flex w-full flex-col gap-2">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
      </div>
    </Card>
  );
}
