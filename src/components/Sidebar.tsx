import { FiGlobe, FiMessageCircle, FiSearch } from "react-icons/fi";
import { CollapsedContext } from "./Menu";
import { MenuItem } from "./MenuItem";

const LatestNews = () => {
  return (
    <div className="card hidden bg-base-200 p-4 xl:flex">
      <div className="card-title text-lg">Latest Update</div>
      Global themes! New menu. Updated profile view. Updated suspense.
    </div>
  );
};

const Threads = () => {
  return (
    <>
      <div className="hidden flex-col gap-2 sm:flex xl:hidden">
        <MenuItem name={""} icon={<FiMessageCircle />}></MenuItem>
        <MenuItem name={""} icon={<FiGlobe />}></MenuItem>
      </div>

      <div className="hidden flex-col justify-center xl:flex">
        <div className="mt-8 text-center text-lg">Threads</div>
        <div className="items-left flex flex-col">
          <div className="font-mono">· Global</div>
        </div>
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

export default function Sidebar() {
  return (
    <div className="sticky top-0 hidden h-screen w-max max-w-xs shrink flex-col gap-2 py-4 px-2 sm:flex">
      <CollapsedContext.Provider value={true}>
        <SearchBar />
        <LatestNews />
        <Threads />
      </CollapsedContext.Provider>
    </div>
  );
}
