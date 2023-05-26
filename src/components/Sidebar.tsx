import Link from "next/link";
import { BsNewspaper } from "react-icons/bs";
import { FiGlobe, FiMessageCircle, FiSearch } from "react-icons/fi";
import { CollapsedContext } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Threads } from "./Threads";

const LatestNews = () => {
  return (
    <>
      <div className="sm:flex xl:hidden">
        <MenuItem name={""} icon={<BsNewspaper />}></MenuItem>
      </div>

      <div className="card hidden bg-base-200 p-4 xl:flex">
        <div className="card-title text-lg">Latest Update</div>
        Modal Post Wizard. New UI components.
      </div>
    </>
  );
};


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
      <div className="flex xl:hidden">
        <MenuItem name={""} icon={<FiSearch />}></MenuItem>
      </div>
      <div className="hidden w-full xl:flex">
        <input
          type="text"
          className="input-bordered input input-md w-full"
          placeholder="Search Twotter?.."
        />
      </div>
    </>
  );
};

export const SidebarButtons = () => {
  return (
    <CollapsedContext.Provider value={true}>
      <SearchBar />
      <Threads />
      <Links />
    </CollapsedContext.Provider>
  );
};

export default function Sidebar() {
  return (
    <div className="sticky top-0 hidden h-screen w-max max-w-xs shrink flex-col gap-2 py-4 px-2 sm:flex xl:gap-4">
      <SidebarButtons />
    </div>
  );
}
