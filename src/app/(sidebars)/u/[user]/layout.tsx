import { Card } from "~/components/ui/card";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getUserByHandle } from "~/utils/getUserByHandle";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { user: string };
}) {
  const handle = params.user;
  const user = await getUserByHandle(handle);

  if (!user) throw new Error("∑(O_O;) Profile not found");
  console.log(user);
  return (
    <>
      <UserProfile user={user} />
      <UserNavigation handle={handle} />

      <Card className="z-[30] hover:bg-card p-4 border-0">{children}</Card>
    </>
  );
}
