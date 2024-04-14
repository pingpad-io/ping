import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { User } from "./post/Post";

export function UserAvatar({ user }: { user: User }) {
  return (
    <Link href={`/u/${user.handle}`}>
      <Avatar className="w-full h-full">
        <AvatarImage alt={user.profilePictureUrl ?? undefined} src={user.profilePictureUrl ?? undefined} />
        <AvatarFallback>{user.handle.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
