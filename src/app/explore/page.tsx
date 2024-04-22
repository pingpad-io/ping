import { Card } from "~/components/ui/card";
import { ExplorePage } from "./ExplorePage";

const home = async () => {
  return (
    <Card className="z-[30] hover:bg-card sticky top-0 flex-col p-4 border-0">
      <ExplorePage />
    </Card>
  );
};

export default home;
