import { useQuery } from "@tanstack/react-query";

interface GroupStats {
  totalMembers: number;
}

const fetchGroupStats = async (groupId: string): Promise<GroupStats> => {
  const response = await fetch(`/api/groups/${groupId}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch group stats");
  }
  return response.json();
};

export function useGroupStats(groupId: string | undefined) {
  return useQuery({
    queryKey: ["groupStats", groupId],
    queryFn: () => fetchGroupStats(groupId!),
    enabled: !!groupId,
    staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
