
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export function UserAvatar () {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user;

  let todo = () => {
    toast.error("Not yet implemented");
  };

  // let avatar_url = await supabase
  //   .from("profiles")
  //   .select("avatar_url")
  //   .eq("id", user?.id)
  //   .single().then(data => data.data?.avatar_url);
  // TODO

  let avatar_url = ""

  return (
    // <UserButton appearance={{}} />
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
};
