import type { Group } from "@lens-protocol/client";
import { useQuery } from "@tanstack/react-query";

export interface GroupWithOperations extends Group {
  isBanned: boolean;
  canJoin: boolean;
  canLeave: boolean;
  canPost: boolean;
}

const fetchGroup = async (groupId: string): Promise<GroupWithOperations> => {
  const response = await fetch(`/api/groups/${groupId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch group");
  }
  const data = await response.json();
  return data;
};

export function useGroup(groupId: string | undefined) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId!),
    enabled: !!groupId,
    staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
