import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { api } from "~/utils/api";

export function UserAvatar({ userId }: { userId?: string }) {
  const { data: profile } = api.profiles.get.useQuery({
    id: userId,
  });

  return (
    <Link href={`/${profile?.username}`}>
      <Avatar className="w-full h-full">
        <AvatarImage alt={profile?.avatar_url ?? undefined} src={profile?.avatar_url ?? undefined} />
        <AvatarFallback>{profile?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
