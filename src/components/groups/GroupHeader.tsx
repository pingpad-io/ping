"use client";

import { Users, Ban } from "lucide-react";
import { Button } from "../ui/button";
import { useGroupStats } from "~/hooks/useGroupStats";
import { useGroupMutations } from "~/hooks/useGroupMutations";
import { useAuth } from "~/hooks/useAuth";
import { resolveUrl } from "~/utils/resolveUrl";
import type { GroupWithOperations } from "~/hooks/useGroup";
import { Card } from "../ui/card";

interface GroupHeaderProps {
  group: GroupWithOperations;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  const iconUrl = resolveUrl(group.metadata?.icon);
  const canJoin = group.canJoin || false;
  const canLeave = group.canLeave || false;
  const { isAuthenticated } = useAuth();
  const { joinMutation, leaveMutation } = useGroupMutations(group.address || "");
  const { data: stats } = useGroupStats(group.address || "");

  const handleJoinLeave = () => {
    if (canJoin) {
      joinMutation.mutate();
    } else if (canLeave) {
      leaveMutation.mutate();
    }
  };

  return (
    <Card className="flex items-center gap-4 p-4 rounded-xl mb-4">
      <div className="flex-shrink-0">
        {group.metadata?.icon ? (
          <img
            src={iconUrl}
            alt={group.metadata?.name || group.address}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold">
          {group.metadata?.name || (group.address ? `Group ${group.address.slice(0, 6)}...${group.address.slice(-4)}` : "Unknown Group")}
        </h1>
        <div className="flex items-center gap-3 mt-1">
          {stats && (
            <p className="text-sm text-muted-foreground">
              {stats.totalMembers} {stats.totalMembers === 1 ? "member" : "members"}
            </p>
          )}
          {group.isBanned && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <Ban size={14} />
              <span>You are banned from this group</span>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (canJoin || canLeave) && (
        <Button
          variant={canLeave ? "outline" : "default"}
          onClick={handleJoinLeave}
          className="px-6"
        >
          {canLeave ? "Leave" : "Join"}
        </Button>
      )}
    </Card>
  );
}