import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { createContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPalette } from "react-icons/bs";
import {
  FiArrowDown,
  FiArrowUp,
  FiBell,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";
import { themes } from "~/styles/themes";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";
import ModalPostWizard from "./ModalPostWizard";
import { SidebarButtons } from "./Sidebar";

export const CollapsedContext = createContext(false);
export default function Menu() {
  const { signOut } = useClerk();
  let [isMoreOpen, setMoreOpen] = useState(false);
  let [isCollapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  let user = useUser();

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
              href={`/${user.user?.username}`}
              name={"Profile"}
              icon={<FiUser />}
            />
          </SignedIn>
          <div className="flex flex-col sm:hidden">
            <SidebarButtons />
          </div>
          {isMoreOpen ? (
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
          )}
          <ModalPostWizard>
            <MenuItem
              className={
                `border-2 border-primary font-bold text-primary hover:border-primary-focus hover:text-primary-focus ` +
                (isCollapsed ? `` : `pl-10 sm:pl-3`)
              }
              name={"Twot"}
              icon={<RiQuillPenLine size={24} />}
            />
          </ModalPostWizard>
        </div>
      </div>
    </CollapsedContext.Provider>
  );
}
