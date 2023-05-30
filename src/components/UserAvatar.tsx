import { Profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function UserAvatar({
  profile,
  size = 48,
  online = false,
}: {
  profile?: {avatar_url: string, username: string};
  size?: number;
  online?: boolean;
}) {
  if (!profile || !profile.avatar_url || !profile.username)
    return (
      <div className={`${online ? "online" : ""} avatar`}>
        <div className="w-12 rounded-full "></div>
      </div>
    );

  return (
    <div className={"avatar " + (online ? "online" : "")}>
      <div className="w-12 rounded-full ">
        <Link href={"/" + profile.username}>
          <Image
            src={profile.avatar_url}
            alt={profile.username + "'s profile image"}
            width={size}
            height={size}
            placeholder="empty"
          />
        </Link>
      </div>
    </div>
  );
}
