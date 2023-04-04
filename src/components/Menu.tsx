import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPalette } from "react-icons/bs";
import {
  FiBell,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMail,
  FiMoreVertical,
  FiUser,
} from "react-icons/fi";
import { themeChange } from "theme-change";
import { themes } from "~/styles/themes";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";

export default function Menu() {
  let user = useUser();
  const { signOut } = useClerk();

  let todo = () => {
    toast.error("Not implemented yet");
  };

  let userButtons = <></>;
  if (user.isSignedIn) {
    userButtons = <></>;
  }

  useEffect(() => {
    themeChange(false);
  }, []);

  let [theme, setTheme] = useState("pink");
  let cycleTheme = () => {
    setTheme(themes[Math.floor(Math.random() * themes.length)] ?? "");
  };

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="sticky top-0 hidden h-screen w-max shrink flex-col place-content-between py-4 px-2 sm:flex">
      <div className="flex flex-col items-end gap-2">
        <div className="font-bold">
          <MenuItem href={"/"} name={"Twotter"} icon={<OtterIcon />} />
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
        <div className="dropdown-hover dropdown-end dropdown relative">
          <MenuItem name={"More"} icon={<FiMoreVertical />} />

          <div className="dropdown-content flex w-max flex-col items-end rounded-xl">
            <MenuItem href="/about" name={"About"} icon={<FiInfo />} />
            <MenuItem
              onClick={cycleTheme}
              name={"Theme"}
              icon={<BsPalette />}
            />
            <SignedIn>
              <MenuItem
                onClick={signOut}
                name={"Sign out"}
                icon={<FiLogOut />}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
