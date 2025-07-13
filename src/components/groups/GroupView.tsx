"use client";

import type { Group } from "@lens-protocol/client";
import { Users } from "lucide-react";
import { resolveUrl } from "~/utils/resolveUrl";
import Link from "~/components/Link";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useGroupStats } from "~/hooks/useGroupStats";
import { useGroupMutations } from "~/hooks/useGroupMutations";
import { useAuth } from "~/hooks/useAuth";

interface GroupViewProps {
  group: Group;
}

function MemberCount({ groupId }: { groupId: string }) {
  const { data, isLoading } = useGroupStats(groupId);

  if (isLoading) {
    return null
  }

  if (!data) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground mt-1">
      {data.totalMembers} {data.totalMembers === 1 ? "member" : "members"}
    </p>
  );
}

export function GroupView({ group }: GroupViewProps) {
  const groupUrl = `/g/${group.address}`;
  const iconUrl = resolveUrl(group.metadata?.icon);
  const canJoin = group.operations.canJoin.__typename === "GroupOperationValidationPassed";
  const canLeave = group.operations.canLeave.__typename === "GroupOperationValidationPassed";
  const { isAuthenticated } = useAuth();
  const { joinMutation, leaveMutation } = useGroupMutations(group.address);

  const handleJoinLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (canJoin) {
      joinMutation.mutate();
    } else if (canLeave) {
      leaveMutation.mutate();
    }
  };

  return (
    <Link href={groupUrl} className="block">
      <Card className="transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {group.metadata?.icon ? (
                <img
                  src={iconUrl}
                  alt={group.metadata?.name || group.address}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {group.metadata?.name || `Group ${group.address.slice(0, 6)}...${group.address.slice(-4)}`}
              </h3>

              <MemberCount groupId={group.address} />
            </div>

            {isAuthenticated && (canJoin || canLeave) && (
              <Button
                size="sm"
                variant={canLeave ? "outline" : "default"}
                onClick={handleJoinLeave}
                // disabled={isLoading}
                className="flex-shrink-0"
              >
                {canLeave ? "Leave" : "Join"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
