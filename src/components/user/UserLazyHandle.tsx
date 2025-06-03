"use client";

import Link from "next/link";
import { UserCard } from "./UserCard";

export const UserLazyHandle = ({ handle }: { handle: string }) => {
  return (
    <UserCard handle={handle}>
      <Link onClick={(e) => e.stopPropagation()} href={`/u/${handle}`} prefetch style={{ color: 'currentColor' }}>
        @{handle}
      </Link>
    </UserCard>
  );
};
