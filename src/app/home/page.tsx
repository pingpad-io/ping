import { HomePage } from "./HomePage";
import { Card } from "~/components/ui/card";

const home = async () => {
  return (
      <Card className="z-[30] hover:bg-card sticky top-0 flex-col p-4 border-0">
        <HomePage />
        {/* <PostWizard /> */}
      </Card>
  );
};

export default home;
