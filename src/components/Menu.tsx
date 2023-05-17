// import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
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
import AuthWizard from "./AuthWizard";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";
import ModalWizard from "./ModalWizard";
import PostWizard from "./PostWizard";
import { SidebarButtons } from "./Sidebar";
import { SignedIn, SignedOut } from "./Signed";

export const CollapsedContext = createContext(false);
export default function Menu() {
  // const { signOut } = useClerk();
  // let [isMoreOpen, setMoreOpen] = useState(false);
  let [isCollapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  // let user = useUser();
  let session = useSession();
  let supabase = useSupabaseClient();

  let user = session?.user;

  let todo = () => toast.error("Not implemented yet");

  let cycleTheme = () => {
    let theme = themes[Math.floor(Math.random() * themes.length)] ?? "";
    setTheme(theme);
  };

  return (
    <CollapsedContext.Provider value={isCollapsed}>
      <div
        className={`sticky top-0 flex h-screen w-32 shrink flex-col place-content-between py-4 px-2`}
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
          <SignedIn>
            <MenuItem
              href={`/${user?.user_metadata.username}`}
              name={"Profile"}
              icon={<FiUser />}
            />
          </SignedIn>
          <div className="flex flex-col sm:hidden">
            <SidebarButtons />
          </div>
          {/* {isMoreOpen ? (
            <div className="flex w-max flex-col items-end rounded-3xl border-dashed border-base-300 hover:-m-1 hover:border-4">
              <MenuItem
                onClick={() => setMoreOpen(false)}
                name={"Less"}
                icon={<FiArrowUp />}
              />
              <MenuItem
                onClick={cycleTheme}
                name={"Theme"}
                icon={<BsPalette />}
              />
              <MenuItem href="/about" name={"About"} icon={<FiInfo />} />
              <SignedIn>
                <MenuItem
                  onClick={signOut}
                  name={"Sign out"}
                  icon={<FiLogOut />}
                />
              </SignedIn>
            </div>
          ) : (
            <div className="flex w-max flex-col items-end rounded-3xl border-dashed border-base-300 hover:-m-1 hover:border-4">
              <MenuItem
                onClick={() => setMoreOpen(true)}
                name={"More"}
                icon={<FiArrowDown />}
              />
            </div>
          )} */}
          <MenuItem onClick={cycleTheme} name={"Theme"} icon={<BsPalette />} />
          <MenuItem onClick={todo} name={"Settings"} icon={<FiSettings />} />
          <SignedIn>
            <MenuItem
              onClick={() => supabase.auth.signOut()}
              name={"Sign out"}
              icon={<FiLogOut />}
            />
          </SignedIn>
          <SignedOut>
            <ModalWizard wizardChildren={<AuthWizard />}>
            <MenuItem
              className="dropdown-right dropdown-hover dropdown"
              name={"Sign In"}
              icon={<FiLogIn />}
            >
              {/* <div className="card dropdown-content w-max px-4 rounded-3xl">
                <AuthWizard />
              </div> */}
            </MenuItem>
            </ModalWizard>
          </SignedOut>
          <ModalWizard wizardChildren={<PostWizard />}>
            <MenuItem
              className={
                `border-2 border-primary font-bold text-primary hover:border-primary-focus hover:text-primary-focus ` +
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
