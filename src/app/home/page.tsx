import { Card } from "~/components/ui/card";
import { HomePage } from "./HomePage";

const home = async () => {
  
  return (
    <Card className="z-[30] hover:bg-card sticky top-0 flex-col p-4 border-0">
      <HomePage />
    </Card>
  );
};

export default home;
