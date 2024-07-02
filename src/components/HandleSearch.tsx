"use client";

import { useSearchProfiles } from "@lens-protocol/react-web";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { lensProfileToUser } from "./user/User";

export function HandleSearch({ query }: { query: string }) {
  const { data: profiles, loading, error } = useSearchProfiles({ query });

  if (error && query) throw new Error(error.message);

  const users = profiles?.map(lensProfileToUser);
  const list = users.map((user) => user.name);

  return (
    <>
      <div className="h-16 flex flex-row gap-2 items-center justify-center sticky top-0 z-10 border-b backdrop-blur-md">
        <Link href={"/"}>
          <Button variant="outline" size="sm">
            <ChevronLeft size={15} />
          </Button>
        </Link>
      </div>
      {query && list}
    </>
  );
}
