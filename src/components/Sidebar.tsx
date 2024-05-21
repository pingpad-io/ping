"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-3 py-4 sm:px-2">
      {pathname !== "/search" && <SearchBar defaultText="" />}
      <Accordion defaultValue={["beta"]} className="w-64" type="multiple">
        <AccordionItem value="beta">
          <AccordionTrigger className="py-2">
            <span>
              About Pingpad
              <Badge className="ml-2 text-sm" variant="outline">
                beta
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>Welcome and thank you for being here so early!</p>
            <p>
              We would love to hear what you think! leave feedback on{" "}
              <a
                className="underline "
                href="https://github.com/pingpad-io/ping/issues"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>{" "}
              or{" "}
              <a className="underline " href="https://discord.gg/DhMeQAXW4F" target="_blank" rel="noreferrer">
                discord
              </a>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
