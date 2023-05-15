import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";

export const UserAvatar = () => {
  // const session = useSession()
  // const supabase = useSupabaseClient()
  let { user } = useUser();
  if (!user) return null;
  let { openUserProfile } = useClerk();

  return (
    // <UserButton appearance={{}} />
    <div className="online avatar ">
      <div className="w-12 rounded-full ">
        <button onClick={() => openUserProfile()}>
          <Image
            src={user.profileImageUrl}
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
