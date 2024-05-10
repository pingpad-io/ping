"use client";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-3 py-3.5 sm:px-2">
      {pathname !== "/search" && <SearchBar defaultText="" />}
      <Collapsible className="w-64">
        <div className="flex items-center justify-between space-x-4">
          <span>
            Pingpad is in{" "}
            <Badge className="text-sm" variant="outline">
              beta
            </Badge>
          </span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-2 pl-2">
          <p>Welcome and thank you for being here so early!</p>
          <p>
            If you encounter any bugs or wish to provide feedback, report it on{" "}
            <a className="underline " href="https://github.com/pingpad-io/ping/issues" target="_blank" rel="noreferrer">
              github
            </a>{" "}
            or @pingpad on lens
          </p>
        </CollapsibleContent>
      </Collapsible>
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
        <Link className="hover:underline" href={"https://discord.gg/DhMeQAXW4F"}>
          Discord
        </Link>
        <Link className="hover:underline" href={"/about"}>
          About
        </Link>
      </div>
      <span className="select-none">© 2024 Pingpad</span>
    </div>
  );
};
