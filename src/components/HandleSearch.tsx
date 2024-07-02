"use client";

import { useSearchProfiles } from "@lens-protocol/react-web";
import { LoadingSpinner } from "./LoadingIcon";
import { lensProfileToUser } from "./user/User";

export function HandleSearch({ query, maxResults = 10 }: { query: string; maxResults?: number }) {
  const { data: profiles, loading, error } = useSearchProfiles({ query });

  if (!query) return null;
  if (error && query) throw new Error(error.message);

  const users = profiles?.slice(0, maxResults).map(lensProfileToUser);
  const list = users.map((user) => user.name);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center">{list}</div>
    </>
  );
}
