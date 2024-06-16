import { Card } from "~/components/ui/card";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getLensClient } from "~/utils/getLensClient";
import { getUserByHandle } from "~/utils/getUserByHandle";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { user: string };
}) {
  const { handle: authenticatedHandle } = await getLensClient();
  const handle = params.user;
  const isUserProfile = handle === authenticatedHandle;
  const user = await getUserByHandle(handle);

  if (!user) throw new Error("∑(O_O;) Profile not found");
  return (
    <>
      <UserProfile user={user} isUserProfile={isUserProfile} />
      <UserNavigation handle={handle} />

      <Card className="z-[30] hover:bg-card p-4 border-0">{children}</Card>
    </>
  );
}
