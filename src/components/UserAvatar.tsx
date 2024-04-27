import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { User } from "./post/Post";

export function UserAvatar({ user, link = true }: { user: User; link?: boolean }) {
  const avatar = (
    <>
      <Avatar className="w-full h-full">
        <AvatarImage alt={user.profilePictureUrl} src={user.profilePictureUrl} />
        <AvatarFallback>
          <img src={getStampUrl(user.address)} alt={user.handle} />
        </AvatarFallback>
      </Avatar>
    </>
  );

  return link ? <Link href={`/u/${user.handle}`}>{avatar}</Link> : avatar;
}

/// Get the URL for a stamp.fyi profile image.
///
/// @param address The address of the profile.
/// @returns The URL for the profile stamp image.
export function getStampUrl(address: string): string {
  return `https://cdn.stamp.fyi/avatar/${address}?s=140`;
}
