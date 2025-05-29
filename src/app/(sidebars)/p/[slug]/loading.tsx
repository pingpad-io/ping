import { Card } from "~/components/ui/card";

export default function loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="z-[30] flex items-center gap-4 border-0 p-4">
        <div className="h-10 w-10 flex-grow-0 flex-shrink-0 rounded-full mb-auto bg-muted animate-pulse" />
        <div className="flex w-full flex-col gap-2 pt-1">
          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-[40%] rounded bg-muted animate-pulse" />
        </div>
      </Card>
    </div>
  );
}
