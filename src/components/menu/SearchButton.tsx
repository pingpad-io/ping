"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export const SearchButton = () => {
  const pathname = usePathname();

  if (pathname !== "/search") {
    return (
      <Link href={"/search"} className="lg:hidden">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">search</div>
          <SearchIcon className="sm:ml-2" size={20} />
        </Button>
      </Link>
    );
  }
};
