const Threads = () => {
  return (
    <>
      <div className="flex justify-center">
        <div className="text-lg">Threads</div>
      </div>
      <div className="font-mono">· Global</div>
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
    <div className="sticky top-0 flex h-screen w-full max-w-xs shrink flex-col gap-4 p-4">
      <SearchBar />
      <Threads />
    </div>
  );
}
