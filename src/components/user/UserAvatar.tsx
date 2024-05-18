import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import type { User } from "./User";
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

export function UserAvatarArray({ users, amountTruncated }: { users: User[]; amountTruncated?: number }) {
  const avatars = users.map((user) => (
    <div key={user.id} className="w-10 h-10 -ml-4">
      <UserAvatar link={true} user={user} />
    </div>
  ));

  const formatAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amountTruncated);

  return (
    <div className="flex flex-row pl-4">
      {avatars}
      {amountTruncated ? (
        <div className="w-10 h-10 -ml-4 rounded-full border-2 text-card-foreground text-base backdrop-blur-md border-accent text-center justify-center items-center flex z-10">
          {formatAmount}
        </div>
      ) : null}
    </div>
  );
}

/// Get the URL for a stamp.fyi profile image.
///
/// @param address The address of the profile.
/// @returns The URL for the profile stamp image.
export function getStampUrl(address: string): string {
  return `https://cdn.stamp.fyi/avatar/${address}?s=140`;
}
