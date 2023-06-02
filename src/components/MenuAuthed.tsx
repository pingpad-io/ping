import { toast } from "react-hot-toast";
import { FiBell, FiLogOut, FiMail, FiSettings, FiUser } from "react-icons/fi";
import { api } from "~/utils/api";
import { MenuItem } from "./MenuItem";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const MenuAuthed = ({ userId }: { userId: string }) => {
  let supabase = useSupabaseClient();
  let ctx = api.useContext();

  let { data: profile, isLoading } = api.profiles.getProfileById.useQuery({
    id: userId,
  });

  if (isLoading || !profile) return null;

  let todo = () => toast.error("Not implemented yet");
  let signOut = () => {
    ctx.invalidate();
    supabase.auth.signOut();
  };

  return (
    <>
      <MenuItem onClick={todo} href={"/"} name={"Messages"} icon={<FiMail />} />
      <MenuItem
        onClick={todo}
        href={"/"}
        name={"Notifications"}
        icon={<FiBell />}
      />
      <MenuItem
        href={profile.username ? `/${profile.username}` : undefined}
        name={"Profile"}
        icon={<FiUser />}
      />
      <MenuItem href="/settings" name={"Settings"} icon={<FiSettings />} />
      <MenuItem
        onClick={() => signOut()}
        name={"Sign out"}
        icon={<FiLogOut />}
      />
    </>
  );
};
