import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { Author } from "~/types/post";

export function UserAvatar({ profile }: { profile: Author }) {
  return (
    <Link href={`/${profile.handle}`}>
      <Avatar className="w-full h-full">
        <AvatarImage alt={profile.profilePictureUrl ?? undefined} src={profile.profilePictureUrl ?? undefined} />
        <AvatarFallback>{profile.handle.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
