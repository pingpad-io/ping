import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export function UserAvatar() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [avatar_url, setAvatarUrl] = useState(null);
  const [username, setUsername] = useState(null);
  let { data } = api.profile.getProfileById.useQuery({ userId: user?.id });

  useEffect(() => {
    async function setData() {
      setAvatarUrl(data?.avatar_url);
      setUsername(data?.username)
    }

    if (user && data) {
      setData();
    }
  }, [user, data]);

  if (!user || !avatar_url || !username) return (

    <div className="online avatar">
      <div className="w-12 rounded-full ">
      </div>
    </div>
   );

  return (
    <div className="online avatar">
      <div className="w-12 rounded-full ">
        <Link href={"/" + username}>
          <Image
            src={avatar_url}
            alt={"profile image"}
            width={48}
            height={48}
            placeholder="empty"
          />
        </Link>
      </div>
    </div>
  );
}
