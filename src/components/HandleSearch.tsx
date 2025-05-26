"use client";

import { LoadingSpinner } from "./LoadingSpinner";
import { lensAcountToUser } from "./user/User";
import { useAccounts } from "@lens-protocol/react";

export function HandleSearch({ query, maxResults = 10 }: { query: string; maxResults?: number }) {
  const { data: profiles, loading, error } = useAccounts({ filter: { searchBy: { localNameQuery: query } } });

  if (!query) return null;
  if (error && query) throw new Error(error);

  const users = profiles?.items?.slice(0, maxResults).map(lensAcountToUser);
  const list = users.map((user) => user.name);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center">{list}</div>
    </>
  );
}
