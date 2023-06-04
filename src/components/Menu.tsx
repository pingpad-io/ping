import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createContext, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiBell,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMail,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";
import { api } from "~/utils/api";
import { OtterIcon } from "./Icons";
import LoginWizard from "./LoginWizard";
import { MenuItem } from "./MenuItem";
import ModalWizard from "./ModalWizard";
import PostWizard from "./PostWizard";
import { SidebarButtons } from "./Sidebar";
import { SignedOut } from "./Signed";

export const CollapsedContext = createContext(false);

export default function Menu() {
  let [isCollapsed, setCollapsed] = useState(false);
  let supabase = useSupabaseClient();
  let ctx = api.useContext();
  let user = useUser();

  let signOut = () => {
    ctx.invalidate();
    supabase.auth.signOut();
  };

  return (
    <CollapsedContext.Provider value={isCollapsed}>
      <div
        className={`sticky top-0 flex h-screen w-max shrink flex-col place-content-between py-4 px-2 text-2xl lg:w-56`}
      >
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-row gap-2">
            {/* <div className="hidden lg:block">
              <MenuItem
                onClick={() => setCollapsed(!isCollapsed)}
                icon={isCollapsed ? <AiOutlineLeft /> : <AiOutlineRight />}
              />
            </div> */}
            <MenuItem
              href="/"
              text={"Twotter"}
              className="font-bold"
              icon={<OtterIcon />}
            />
          </div>

          <MenuItem href={"/"} text={"Home"} icon={<FiHome />} />

          {user && <MenuAuthed userId={user.id} />}

          <div className="flex flex-col sm:hidden">
            <SidebarButtons />
          </div>

          {user && (
            <MenuItem
              onClick={() => signOut()}
              text={"Sign out"}
              icon={<FiLogOut />}
            />
          )}

          <SignedOut>
            <ModalWizard wizardChildren={<LoginWizard />}>
              <MenuItem
                className="dropdown-right dropdown-hover dropdown"
                text={"Sign In"}
                icon={<FiLogIn />}
              ></MenuItem>
            </ModalWizard>
          </SignedOut>

          <ModalWizard wizardChildren={<PostWizard />}>
            <MenuItem
              className={
                `my-2 border-2 border-primary font-bold text-primary hover:border-primary-focus hover:text-primary-focus ` +
                (isCollapsed ? `` : `pl-3 lg:pl-10`)
              }
              text={"Twot"}
              icon={<RiQuillPenLine size={24} />}
            />
          </ModalWizard>
        </div>
      </div>
    </CollapsedContext.Provider>
  );
}

export const MenuAuthed = ({ userId }: { userId: string }) => {

  let { data: profile, isLoading } = api.profiles.getProfileById.useQuery({
    id: userId,
  });

  let todo = () => toast.error("Not implemented yet");

  return (
    <>
      <MenuItem onClick={todo} href={"/"} text={"Messages"} icon={<FiMail />} />
      <MenuItem
        onClick={todo}
        href={"/"}
        text={"Notifications"}
        icon={<FiBell />}
      />
      <MenuItem
        href={profile?.username ? `/${profile.username}` : undefined}
        text={"Profile"}
        icon={<FiUser />}
      />
      <MenuItem href="/settings" text={"Settings"} icon={<FiSettings />} />
    </>
  );
};
