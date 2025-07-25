import { useQuery } from "@tanstack/react-query";

interface CommunityStats {
  totalMembers: number;
}

const fetchCommunityStats = async (communityId: string): Promise<CommunityStats> => {
  const response = await fetch(`/api/communities/${communityId}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch community stats");
  }
  return response.json();
};

export function useCommunityStats(communityId: string | undefined) {
  return useQuery({
    queryKey: ["communityStats", communityId],
    queryFn: () => fetchCommunityStats(communityId!),
    enabled: !!communityId,
    staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
