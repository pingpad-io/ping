import { notFound } from "next/navigation";
import { Card } from "~/components/ui/card";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getUserByHandle } from "~/utils/getUserByHandle";

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
  const user = await getUserByHandle(handle);

  if (!user) return notFound();

  return (
    <>
      <UserProfile user={user} />
      <UserNavigation handle={handle} />

      <Card className="z-[30] hover:bg-card p-4 border-0">{children}</Card>
    </>
  );
}
