import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { User } from "./post/Post";

export function UserAvatar({ user, link = true }: { user: User; link: boolean }) {
  return (
    <>
      {link ? (
        <Link href={`/u/${user.handle}`}>
          <Avatar className="w-full h-full">
            <AvatarImage alt={user.profilePictureUrl ?? undefined} src={user.profilePictureUrl ?? undefined} />
            <AvatarFallback>{user.handle.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Avatar className="w-full h-full">
          <AvatarImage alt={user.profilePictureUrl ?? undefined} src={user.profilePictureUrl ?? undefined} />
          <AvatarFallback>{user.handle.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}
    </>
  );
}
