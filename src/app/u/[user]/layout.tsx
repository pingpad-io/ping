import { fetchAccountStats } from "@lens-protocol/client/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getServerAuth } from "~/utils/getServerAuth";
import { getUserByUsername } from "~/utils/getUserByHandle";

export const maxDuration = 60;
export const revalidate = 0;
export const dynamic = "force-dynamic";

async function UserProfileSection({ handle }: { handle: string }) {
  const user = await getUserByUsername(handle);
  if (!user) return notFound();

  const { client } = await getServerAuth();
  const stats = await fetchAccountStats(client, { account: user.address }).unwrapOr(null);

  return (
    <>
      <UserProfile user={user} stats={stats} />
      <UserNavigation handle={handle} />
    </>
  );
}

function UserProfileSkeleton() {
  return (
    <>
      {/* UserProfile skeleton - matching the actual component structure */}
      <div className="p-4 z-20 flex w-full flex-row gap-4 glass drop-shadow-md mt-4 rounded-xl">
        <div className="flex flex-col gap-2">
          <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>
        <div className="flex flex-col grow place-content-around gap-2">
          <div className="flex flex-row gap-2 items-center justify-between h-10">
            <span className="flex flex-row gap-2 items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </span>
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-row gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      {/* UserNavigation skeleton */}
      <nav className="sticky top-3 w-fit max-w-2xl mx-auto glass border border-muted rounded-xl z-[40] flex flex-row justify-start items-start gap-2 p-1">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-16 rounded-lg" />
      </nav>
    </>
  );
}

export default function layout({ children, params }: { children: React.ReactNode; params: { user: string } }) {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileSection handle={params.user} />
      </Suspense>

      <div className="z-[30]">{children}</div>
    </div>
  );
}
