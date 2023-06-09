import Link from "next/link";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiGlobe, FiSearch } from "react-icons/fi";
import { CollapsedContext } from "./Menu";
import { MenuItem } from "./MenuItem";
import { ThreadLink } from "./ThreadLink";
import Threads from "./Threads";

const Links = () => {
  return (
    <>
      <div className="hidden h-fit w-fit flex-row flex-wrap gap-2 overflow-auto text-sm text-base-content xl:flex">
        <Link className=" hover:underline" href={"/policy"}>
          Privacy Policy
        </Link>
        <Link className=" hover:underline" href={"/conditions"}>
          Terms of Service
        </Link>
        <Link className=" hover:underline" href={"/about"}>
          About
        </Link>
        <p className="select-none">© 2023 K.U Corp.</p>
      </div>
    </>
  );
};

const SearchBar = () => {
  return (
    <>
      <div className="hidden w-full xl:flex">
        <input type="text" className="input-bordered input input-md w-full" placeholder="Search Twotter?.." />
      </div>

      <div className="xl:hidden">
        <MenuItem href="/search" icon={<FiSearch size={24} />} />
      </div>
    </>
  );
};

const ThreadsBar = () => {
  return (
    <>
      <div className="hidden rounded-xl bg-base-200 xl:flex">
        <Threads />
      </div>

      <div className="flex flex-col gap-2 xl:hidden">
        <MenuItem href="/threads" icon={<BiMessageSquareDetail size={24} />} />
        <ThreadLink threadName="global">
          <MenuItem icon={<FiGlobe size={24} />} />
        </ThreadLink>
      </div>
    </>
  );
};

export const SidebarButtons = () => {
  return (
    <CollapsedContext.Provider value={true}>
      <SearchBar />
      <ThreadsBar />
      <Links />
    </CollapsedContext.Provider>
  );
};

export default function Sidebar() {
  return (
    <>
      <div className="sticky top-0 hidden h-screen w-max max-w-xs shrink flex-col gap-2 px-2 py-4 md:flex xl:gap-4">
        <SidebarButtons />
      </div>
    </>
  );
}
