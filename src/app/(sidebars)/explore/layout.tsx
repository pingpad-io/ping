import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "~/components/auth/ServerSignedIn";
import { ExploreNavigation } from "~/components/menu/Navigation";
import PostWizard from "~/components/post/PostWizard";
import { Card } from "~/components/ui/card";
import { getServerAuth } from "~/utils/getServerAuth";

export default async function layout({ children }: PropsWithChildren) {
  const { user } = await getServerAuth();

  return (
    <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
      <ServerSignedIn>
        <ExploreNavigation />
        <div className="pb-4">
          <PostWizard user={user} />
        </div>
      </ServerSignedIn>
      {children}
    </Card>
  );
}
