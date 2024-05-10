"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  function selectedStyle(path: string) {
    if (path === pathname) {
      return "font-bold underline underline-offset-4";
    }
  }

  return (
    <nav className="z-[100] flex flex-row justify-around items-center p-4 sticky top-0 backdrop-blur-md rounded-b-lg">
      <Link className={selectedStyle("/home")} href={"/home"}>
        For You
      </Link>
      <Link className={selectedStyle("/best")} href={"/best"}>
        Best
      </Link>
      <Link className={selectedStyle("/explore")} href={"/explore"}>
        Explore
      </Link>
    </nav>
  );
};
