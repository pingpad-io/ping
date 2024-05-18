"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();
  const selectedStyle = (path: string) => (path === pathname ? "font-bold underline underline-offset-4" : "");

  if (pathname.split("/")[1] === "explore") {
    return <ExploreNavigation />;
  }

  return (
    <nav className="z-[40] flex flex-row justify-around items-center p-4 sticky top-0 backdrop-blur-md rounded-b-lg">
      <Link className={selectedStyle("/home")} href={"/home"}>
        For you
      </Link>
      <Link className={selectedStyle("/best")} href={"/best"}>
        Best
      </Link>
    </nav>
  );
};

const ExploreNavigation = () => {
  const pathname = usePathname();
  const selectedStyle = (path: string) => (path === pathname ? "font-bold underline underline-offset-4" : "");

  return (
    <nav className="z-[40] flex flex-row justify-around items-center p-4 sticky top-0 backdrop-blur-md rounded-b-lg">
      <Link className={selectedStyle("/explore/latest")} href={"/explore/latest"}>
        Latest
      </Link>
      <Link className={selectedStyle("/explore/best")} href={"/explore/best"}>
        Best
      </Link>
      <Link className={selectedStyle("/explore/collected")} href={"/explore/collected"}>
        Collected
      </Link>
    </nav>
  );
};
