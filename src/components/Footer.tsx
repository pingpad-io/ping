import { useClerk, useUser } from "@clerk/nextjs";
import { FiInfo, FiLogOut } from "react-icons/fi";
import { MenuItem } from "./MenuItem";

export default function Footer() {
  const { signOut } = useClerk();
  return (
    <>
      <div>
        {/* <MenuItem onClick={signOut} name={"Sign out"} icon={<FiLogOut />} /> */}
        {/* <MenuItem href={"/about"} name={"About"} icon={<FiInfo />} /> */}
      </div>
    </>
  );
}
