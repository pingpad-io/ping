import type { PropsWithChildren } from "react";
import { ServerSignedIn } from "~/components/auth/ServerSignedIn";
import { FeedPostComposer } from "~/components/FeedPostComposer";
import { getServerAuth } from "~/utils/getServerAuth";

export const maxDuration = 60;
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function layout({ children }: PropsWithChildren) {
  const { user } = await getServerAuth();

  return (
    <div className="z-[30] p-4 py-0">
      <ServerSignedIn>
        <div className="pt-4 pb-2">
          <FeedPostComposer user={user} />
        </div>
      </ServerSignedIn>
      {children}
    </div>
  );
}
