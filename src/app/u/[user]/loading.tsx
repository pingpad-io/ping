import { FeedSuspense } from "~/components/FeedSuspense";
import { Card } from "~/components/ui/card";

export default function loading() {
  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <FeedSuspense />
    </Card>
  );
}
