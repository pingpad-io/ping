import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { User } from "./User";
import { UserCard } from "./UserCard";

export function UserAvatar({ user, link = true, card = true }: { user: User; link?: boolean; card?: boolean }) {
  const avatar = (
    <Avatar className="w-full h-full">
      <AvatarImage alt={user?.profilePictureUrl} src={user?.profilePictureUrl} />
      <AvatarFallback>
        <img src={getStampUrl(user.address)} alt={user.handle} />
      </AvatarFallback>
    </Avatar>
  );
  const avatarLink = link ? <Link href={`/u/${user.handle}`}>{avatar}</Link> : avatar;
  const avatarCard = card ? <UserCard user={user}>{avatarLink}</UserCard> : avatarLink;

  return avatarCard;
}

export function UserAvatarArray({ users }: { users: User[] }) {
  const avatars = users.map((user, idx) => (
    <div key={user.id + idx} className="w-10 h-10 -ml-4">
      <UserAvatar link={true} user={user} />
    </div>
  ));

  return <div className="flex flex-row pl-4">{avatars}</div>;
}

/// Get the URL for a stamp.fyi profile image.
///
/// @param address The address of the profile.
/// @returns The URL for the profile stamp image.
export function getStampUrl(address: string): string {
  return `https://cdn.stamp.fyi/avatar/${address}?s=140`;
}
