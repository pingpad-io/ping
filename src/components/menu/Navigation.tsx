"use client";

import { ClockIcon, CrownIcon, HomeIcon, NewspaperIcon, PlusCircleIcon, TelescopeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  return (
    <nav className="z-[40] flex flex-row justify-start items-center p-2 gap-2 sticky top-0 backdrop-blur-md rounded-b-lg">
      <NavigationItem href={"/home"}>
        <HomeIcon size={18} />
      </NavigationItem>
      <NavigationItem href={"/best"}>
        <CrownIcon size={18} />
      </NavigationItem>
      <NavigationItem href={"/explore/curated"}>
        <NewspaperIcon size={18} />
      </NavigationItem>
      <NavigationItem href={"/explore/collected"}>
        <PlusCircleIcon size={18} />
      </NavigationItem>
      <NavigationItem href={"/explore/latest"}>
        <ClockIcon size={18} />
      </NavigationItem>
    </nav>
  );
};

export const NavigationItem = ({ children, href }) => {
  const pathname = usePathname();
  const selectedStyle = (path: string) =>
    path === pathname ? "border-2 font-bold bg-accent text-accent-foreground" : "";

  return (
    <Link
      className={`rounded-full border aspect-square w-10 h-10 overflow-hidden inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted 
  hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${selectedStyle(href)}`}
      href={href}
    >
      {children}
    </Link>
  );
};
