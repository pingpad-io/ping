import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "~/components/auth/ServerSignedIn";
import { Navigation } from "~/components/menu/Navigation";
import PostWizard from "~/components/post/PostWizard";
import { Card } from "~/components/ui/card";
import { getServerAuth } from "~/utils/getServerAuth";

export const maxDuration = 60;
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function layout({ children }: PropsWithChildren) {
  const { user } = await getServerAuth();

  return (
    <div className="z-[30] p-4 py-0">
      <ServerSignedIn>
        {/* <Navigation /> */}
        <div className="py-4">
          <PostWizard user={user} />
        </div>
      </ServerSignedIn>
      {children}
    </div>
  );
}
