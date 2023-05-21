import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useTheme } from "next-themes";
import { createContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPalette } from "react-icons/bs";
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
import { themes } from "~/styles/themes";
import { api } from "~/utils/api";
import AuthWizard from "./AuthWizard";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";
import ModalWizard from "./ModalWizard";
import PostWizard from "./PostWizard";
import { SidebarButtons } from "./Sidebar";
import { SignedIn, SignedOut } from "./Signed";

export const CollapsedContext = createContext(false);

export default function Menu() {
  let [isCollapsed, setCollapsed] = useState(false);
  let { theme, setTheme } = useTheme();
  let supabase = useSupabaseClient();
  let user = useUser();
  let ctx = api.useContext();

  let signOut = () => {
    ctx.invalidate();
    supabase.auth.signOut();
  };

  let { data: profile } = api.profile.getProfileById.useQuery({
    userId: user?.id,
  });

  let todo = () => toast.error("Not implemented yet");
  let cycleTheme = () => {
    let theme = themes[Math.floor(Math.random() * themes.length)] ?? "";
    setTheme(theme);
  };

  return (
    <CollapsedContext.Provider value={isCollapsed}>
      <div
        className={`sticky top-0 flex h-screen w-max shrink flex-col place-content-between py-4 px-2 lg:w-56`}
      >
        <div className="flex flex-col items-end gap-2">
          <div className="font-bold">
            <MenuItem
              onClick={() => setCollapsed(!isCollapsed)}
              name={"Twotter"}
              icon={<OtterIcon />}
            />
          </div>
          <MenuItem href={"/"} name={"Home"} icon={<FiHome />} />
          <SignedIn>
            <MenuItem
              onClick={todo}
              href={"/"}
              name={"Messages"}
              icon={<FiMail />}
            />
            <MenuItem
              onClick={todo}
              href={"/"}
              name={"Notifications"}
              icon={<FiBell />}
            />
            {
              <MenuItem
                href={profile?.username ? `/${profile?.username}` : undefined}
                name={"Profile"}
                icon={<FiUser />}
              />
            }
          </SignedIn>
          <div className="flex flex-col sm:hidden">
            <SidebarButtons />
          </div>
          <MenuItem onClick={cycleTheme} name={"Theme"} icon={<BsPalette />} />
          <MenuItem href="/settings" name={"Settings"} icon={<FiSettings />} />
          <SignedIn>
            <MenuItem
              onClick={() => signOut()}
              name={"Sign out"}
              icon={<FiLogOut />}
            />
          </SignedIn>
          <SignedOut>
            <ModalWizard wizardChildren={<AuthWizard />}>
              <MenuItem
                className="dropdown-hover dropdown-right dropdown"
                name={"Sign In"}
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
              name={"Twot"}
              icon={<RiQuillPenLine size={24} />}
            />
          </ModalWizard>
        </div>
      </div>
    </CollapsedContext.Provider>
  );
}
