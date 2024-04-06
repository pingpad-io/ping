import { Feed } from "~/components/Feed";
import { HomePage } from "./HomePage";
import { Card } from "~/components/ui/card";
import { LensClient, production } from "@lens-protocol/client";

const home = async () => {
  return (
    <>
      <Card className="z-[30] sticky top-0 flex-col hidden sm:flex flex-none p-4 border-0">
        <HomePage />
        {/* <PostWizard /> */}
      </Card>
    </>
  );
};

export default home;
