import { FiGlobe, FiMessageCircle, FiSearch } from "react-icons/fi";
import { CollapsedContext } from "./Menu";
import { MenuItem } from "./MenuItem";
import { BsNewspaper } from "react-icons/bs";

const LatestNews = () => {
  return (
    <>
      <div className="sm:flex xl:hidden">
        <MenuItem name={""} icon={<BsNewspaper />}></MenuItem>
      </div>

      <div className="card bg-base-200 p-4 hidden xl:flex">
        <div className="card-title text-lg">Latest Update</div>
        Global themes! New menu. Updated profile view. Updated suspense.
      </div>
    </>
  );
};

const Threads = () => {
  return (
    <>
      <div className="flex-col gap-2 sm:flex xl:hidden">
        <MenuItem name={""} icon={<FiMessageCircle />}></MenuItem>
        <MenuItem name={""} icon={<FiGlobe />}></MenuItem>
      </div>

      <div className="card hidden flex-col justify-center bg-base-300 p-4 xl:flex">
        <div className="card-title">Threads</div>
        <div className="flex flex-col">
          <div className="link-hover link p-4">- Global</div>
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
    <div className="sticky top-0 hidden h-screen w-max max-w-xs shrink flex-col gap-2 py-4 px-2 sm:flex xl:gap-4">
      <CollapsedContext.Provider value={true}>
        <SearchBar />
        <LatestNews />
        <Threads />
      </CollapsedContext.Provider>
    </div>
  );
}
