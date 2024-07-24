"use client";

import Link from "next/link";
import { UserCard } from "./UserCard";

export const UserLazyHandle = ({ handle }: { handle: string }) => {
  return (
    <UserCard handle={handle}>
      <Link onClick={(e) => e.preventDefault()} href={`/u/${handle}`} prefetch>
        @{handle}
      </Link>
    </UserCard>
  );
};
