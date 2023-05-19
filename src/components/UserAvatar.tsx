import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function UserAvatar() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [avatar_url, setAvatarUrl] = useState("");

  let todo = () => {
    toast.error("Not yet implemented");
  };

  useEffect(() => {
    async function loadData() {
      let avatar_url = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user?.id)
        .single()
        .then((data) => data.data?.avatar_url);
      setAvatarUrl(avatar_url);
    }

    if (user) {
      loadData();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="online avatar ">
      <div className="w-12 rounded-full ">
        <button onClick={() => todo()}>
          <Image
            src={avatar_url}
            alt={"profile image"}
            width={48}
            height={48}
            placeholder="empty"
          />
        </button>
      </div>
    </div>
  );
}
