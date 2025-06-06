import { fetchAccountStats } from "@lens-protocol/client/actions";
import { notFound } from "next/navigation";
import { Card } from "~/components/ui/card";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getServerAuth } from "~/utils/getServerAuth";
import { getUserByUsername } from "~/utils/getUserByHandle";

export const maxDuration = 60;
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { user: string };
}) {
  const handle = params.user;
  const user = await getUserByUsername(handle);

  if (!user) return notFound();

  const { client } = await getServerAuth();
  const stats = await fetchAccountStats(client, { account: user.address }).unwrapOr(null);

  return (
    <div className="flex flex-col gap-2">
      <UserProfile user={user} stats={stats} />
      <UserNavigation handle={handle} />

      <div className="z-[30]">{children}</div>
    </div>
  );
}
