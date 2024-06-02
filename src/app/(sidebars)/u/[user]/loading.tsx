import { FeedSuspense } from "~/components/Feed";
import { Card } from "~/components/ui/card";

export default function loading() {
  const avatar = (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 sm:h-24 sm:w-24 animate-pulse rounded-full bg-muted" />
    </div>
  );
  const content = (
    <div className="flex h-full flex-col items-start justify-center gap-2">
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
      <div className="my-2 h-4 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
  return (
    <>
      <div className="sticky top-0 p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
        {avatar}

        <div className="flex flex-col grow place-content-around">
          <div className="flex flex-row gap-2 place-items-center h-6">{content}</div>
          <div className="text-sm text-base-content grow">{content}</div>
        </div>
      </div>

      <Card className="z-[30] hover:bg-card p-4 border-0">
        <FeedSuspense />
      </Card>
    </>
  );
}
