import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function useEfpList() {
  const { address, isConnected } = useAccount();
  const [efpListTokenId, setEfpListTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEfpList = async () => {
    if (!isConnected || !address) {
      setEfpListTokenId(null);
      return;
    }

    setLoading(true);
    try {
      // Fetch the user's primary EFP list from the API
      const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${address}/primary-list`, {
        cache: 'no-cache', // Prevent caching to get latest data
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.token_id) {
          setEfpListTokenId(data.token_id.toString());
        } else {
          // If no token_id, explicitly set to null
          setEfpListTokenId(null);
        }
      } else if (response.status === 404) {
        // User doesn't have a list yet
        setEfpListTokenId(null);
      }
    } catch (error) {
      console.error("Error fetching EFP list:", error);
      setEfpListTokenId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEfpList();
  }, [address, isConnected]);

  return { efpListTokenId, loading, refetch: fetchEfpList };
}
