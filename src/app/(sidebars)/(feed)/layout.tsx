import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { Navigation } from "~/components/menu/Navigation";
import PostWizard from "~/components/post/PostWizard";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getLensClient } from "~/utils/getLensClient";

export default async function layout({ children }: PropsWithChildren) {
  const { user } = await getLensClient();

  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <ServerSignedIn>
        {/* <Separator className="max-w-sm mx-auto" /> */}
        <Navigation />
        <div className="py-4">
          <PostWizard user={user} />
        </div>
      </ServerSignedIn>
      {children}
    </Card>
  );
}
