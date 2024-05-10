import { Feed } from "~/components/Feed";
import { Navigation } from "~/components/menu/Navigation";
import { Card } from "~/components/ui/card";

export default function Loading() {
  return (
    <Card className="z-[30] hover:bg-card p-4 pt-0 border-0">
      <Navigation />
      <Feed />
    </Card>
  );
}
