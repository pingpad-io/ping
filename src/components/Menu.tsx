import { useClerk, useUser } from "@clerk/nextjs";
import {
  FiGlobe,
  FiHome,
  FiInfo,
  FiLogIn,
  FiLogOut,
  FiMail,
  FiUser,
} from "react-icons/fi";
import Footer from "./Footer";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";

export default function Menu() {
  let user = useUser();
  const { signOut, openSignIn } = useClerk();

  let logButton = user.isSignedIn ? (
    <MenuItem onClick={signOut} name={"Sign out"} icon={<FiLogOut />} />
  ) : (
    <MenuItem onClick={openSignIn} name={"Sign In"} icon={<FiLogIn />} />
  );
  return (
    <div className="sticky top-0 hidden h-screen w-max shrink flex-col place-content-between py-4 px-2 sm:flex">
      <div className="flex flex-col items-end gap-2">
        <div className="font-bold">
          <MenuItem href={"/"} name={"Twotter"} icon={<OtterIcon />} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <MenuItem href={"/"} name={"Home"} icon={<FiHome />} />
          <MenuItem
            href={`/${user.user?.username}`}
            name={"Profile"}
            icon={<FiUser />}
          />
          <MenuItem href={"/"} name={"Global"} icon={<FiGlobe />} />
          <MenuItem href={"/"} name={"Messages"} icon={<FiMail />} />
          <MenuItem href={"/about"} name={"About"} icon={<FiInfo />} />
          {logButton}
        </div>
      </div>
      <Footer />
    </div>
  );
}
