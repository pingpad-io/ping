"use client";

import Link from "~/components/Link";
import { useGroup } from "~/hooks/useGroup";
import { Skeleton } from "../ui/skeleton";
import { GroupView } from "./GroupView";

interface TrendingGroupsProps {
  groupAddresses: string[];
  showAll?: boolean;
}

function TrendingGroupItem({ address, isVertical = true }: { address: string; isVertical?: boolean }) {
  const { data: group, isLoading } = useGroup(address);

  if (isLoading) {
    return (
      <div className="flex-1">
        <Skeleton className={isVertical ? "h-[200px] rounded-xl" : "h-[80px] rounded-xl"} />
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div className="flex-1">
      <GroupView group={group} isVertical={isVertical} showJoin={!isVertical} />
    </div>
  );
}

export function TrendingGroups({ groupAddresses, showAll = false }: TrendingGroupsProps) {
  if (groupAddresses.length === 0) {
    return null;
  }

  const displayAddresses = showAll ? groupAddresses : groupAddresses.slice(0, 4);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trending Communities</h2>
        {!showAll && groupAddresses.length > 4 && (
          <Link href="/communities/trending" className="text-sm text-muted-foreground hover:text-foreground">
            Show all
          </Link>
        )}
      </div>
      {showAll ? (
        <div className="space-y-4">
          {displayAddresses.map((address, index) => (
            <TrendingGroupItem key={`${address}-${index}`} address={address} isVertical={false} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="hidden lg:contents">
            {displayAddresses.map((address, index) => (
              <TrendingGroupItem key={`${address}-${index}`} address={address} />
            ))}
          </div>
          <div className="contents lg:hidden">
            {displayAddresses.slice(0, 3).map((address, index) => (
              <TrendingGroupItem key={`${address}-${index}`} address={address} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
