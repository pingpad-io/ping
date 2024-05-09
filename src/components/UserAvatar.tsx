import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { User } from "./user/User";

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

export function UserAvatarArray({ users }: { users: User[] }) {
  const avatars = users.map((user) => (
    <div key={user.id} className="w-10 h-10 -mr-4 hover:mr-0 transition-all duration-200">
      <UserAvatar link={true} user={user} />
    </div>
  ));
  return <div className="flex flex-row mr-4">{avatars}</div>;
}

/// Get the URL for a stamp.fyi profile image.
///
/// @param address The address of the profile.
/// @returns The URL for the profile stamp image.
export function getStampUrl(address: string): string {
  return `https://cdn.stamp.fyi/avatar/${address}?s=140`;
}
