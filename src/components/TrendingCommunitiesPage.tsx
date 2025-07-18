"use client";

import type { Group } from "@lens-protocol/client";
import { ArrowLeft } from "lucide-react";
import { Feed } from "~/components/Feed";
import { GroupView } from "~/components/groups/GroupView";
import Link from "~/components/Link";

type GroupWithId = Group & { id: string };

const GroupViewWrapper = ({ item }: { item: GroupWithId }) => {
  return <GroupView group={item} />;
};

export default function TrendingCommunitiesPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/communities"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Trending Communities</h1>
      </div>

      <Feed<GroupWithId> ItemView={GroupViewWrapper} endpoint="/api/groups/trending" queryKey={["trending-groups"]} />
    </div>
  );
}
