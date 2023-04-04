const Threads = () => {
  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="card bg-base-200 p-4">
          <div className="card-title text-lg">Latest Update</div>
          Themes are now global. Updated post view suspense
        </div>

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
      <div className="w-full">
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
    <div className="sticky top-0 hidden h-screen w-full max-w-xs shrink flex-col gap-4 p-4 md:flex">
      <SearchBar />
      <Threads />
    </div>
  );
}
