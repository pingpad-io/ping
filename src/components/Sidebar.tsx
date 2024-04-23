import Link from "next/link";
import { SearchBar } from "./SearchBar";

export function Sidebar() {
  return (
    <div className="flex flex-col gap-3 py-3.5 sm:px-2">
      <SearchBar defaultText="" />
      <Links />
    </div>
  );
}
const Links = () => {
  return (
    <div className="flex flex-col gap-1 text-xs ">
      <div className="flex flex-wrap h-fit w-fit gap-1 overflow-auto">
        <Link className="hover:underline" href={"/tos"}>
          ToS
        </Link>
        <Link className="hover:underline" href={"/policy"}>
          Privacy
        </Link>
        <Link href="https://github.com/pingpad-io/ping/" className="hover:underline" target="_blank" rel="noreferrer">
          GitHub
        </Link>
        <Link className="hover:underline" href={"/about"}>
          About
        </Link>
      </div>
      <span className="select-none">© 2024</span>
    </div>
  );
};
