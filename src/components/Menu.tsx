import { FiGlobe, FiHome, FiLogOut, FiMail, FiUser } from "react-icons/fi";
import Footer from "./Footer";
import { OtterIcon } from "./Icons";
import { MenuItem } from "./MenuItem";

export default function Menu() {
  return (
    <div className="sticky top-0 flex h-screen w-max shrink flex-col place-content-between p-4">
      <div className="flex flex-col gap-4">
        <div className="font-bold">
          <MenuItem href={"/profile"} name={"Twotter"} icon={<OtterIcon />} />
        </div>
        <div className="flex flex-col gap-4 pl-1">
          <MenuItem href={"/"} name={"Home"} icon={<FiHome />} />
          <MenuItem href={"/"} name={"Profile"} icon={<FiUser />} />
          <MenuItem href={"/"} name={"Global"} icon={<FiGlobe />} />
          <MenuItem href={"/"} name={"Messages"} icon={<FiMail />} />
          <MenuItem href={"/"} name={"Sign out"} icon={<FiLogOut />} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
