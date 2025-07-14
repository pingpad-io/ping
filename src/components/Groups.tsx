"use client";

import type { Group } from "@lens-protocol/client";
import { useSearchParams } from "next/navigation";
import { Feed } from "~/components/Feed";
import { GroupView } from "~/components/groups/GroupView";
import { TrendingGroups } from "~/components/groups/TrendingGroups";
import { SearchBar } from "~/components/menu/Search";
import { TRENDING_GROUP_ADDRESSES } from "~/constants/trendingGroups";

interface GroupsProps {
  initialQuery?: string;
}

type GroupWithId = Group & { id: string };

const GroupViewWrapper = ({ item }: { item: GroupWithId }) => {
  return <GroupView group={item} />;
};

export default function Groups({ initialQuery = "" }: GroupsProps) {
  const searchParams = useSearchParams();
  const query = initialQuery || searchParams.get("q") || "";

  return (
    <>
      <div className="mb-6">
        <SearchBar defaultText={query} />
      </div>

      {!query && <TrendingGroups groupAddresses={TRENDING_GROUP_ADDRESSES} />}

      <Feed<GroupWithId>
        ItemView={GroupViewWrapper}
        endpoint={`/api/groups${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        queryKey={["groups", query]}
      />
    </>
  );
}
