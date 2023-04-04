import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
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
import { themeChange } from "theme-change";
import { globalThemeContext, themes } from "~/styles/themes";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";
import { SidebarButtons } from "./Sidebar";

export const CollapsedContext = createContext(false);
export default function Menu() {
  const { signOut } = useClerk();
  let theme = useContext(globalThemeContext);
  let [isExpanded, setExpanded] = useState(false);
  let [isCollapsed, setCollapsed] = useState(false);
  let user = useUser();

  let todo = () => toast.error("Not implemented yet");

  useEffect(() => {
    themeChange(false);
  }, []);

  let cycleTheme = () => {
    theme = themes[Math.floor(Math.random() * themes.length)] ?? "";
    document.querySelector("html")?.setAttribute("data-theme", theme);
  };

  return (
    <CollapsedContext.Provider value={isCollapsed}>
      <div className="sticky top-0 flex h-screen w-max shrink flex-col place-content-between py-4 px-2">
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
          {isExpanded ? (
            <div className="flex w-max flex-col items-end rounded-3xl border-dashed border-base-300 hover:-m-1 hover:border-4">
              <MenuItem
                onClick={() => setExpanded(false)}
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
                onClick={() => setExpanded(true)}
                name={"More"}
                icon={<FiArrowDown />}
              />
            </div>
          )}
        </div>
      </div>
    </CollapsedContext.Provider>
  );
}
