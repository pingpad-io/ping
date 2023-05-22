import { Profile } from "@prisma/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function UserAvatar({
  profile,
  size,
  online,
}: {
  profile?: Profile;
  size?: number;
  online?: boolean;
}) {
  const imageSize = size ? size : 48;
  const supabase = useSupabaseClient();
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (profile && profile.avatar_url && profile.username) {
      setAvatarUrl(profile.avatar_url);
      setUsername(profile.username);
    }
  }, [profile]);

  if (!profile || !avatar_url || !username)
    return (
      <div className={`${online ? "online" : ""} avatar`}>
        <div className="w-12 rounded-full "></div>
      </div>
    );

  return (
    <div className="online avatar">
      <div className="w-12 rounded-full ">
        <Link href={"/" + username}>
          <Image
            src={avatar_url}
            alt={username + "'s profile image"}
            width={imageSize}
            height={imageSize}
            placeholder="empty"
          />
        </Link>
      </div>
    </div>
  );
}
