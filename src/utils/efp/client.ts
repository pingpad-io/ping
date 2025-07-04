const EFP_API_BASE_URL = "https://api.ethfollow.xyz/api/v1";

export interface EfpUserStats {
  followers_count: number;
  following_count: number;
}

export interface EfpEnsData {
  address: string;
  ens: string;
  avatar?: string;
  name?: string;
  header?: string;
}

export interface EfpFollower {
  address: string;
  ens?: string;
  avatar?: string;
  efp_list_nft_token_id?: string;
  tags?: string[];
  is_following?: boolean;
  is_blocked?: boolean;
  is_muted?: boolean;
  updated_at?: string;
}

export interface EfpApiResponse<T> {
  data: T;
  error?: string;
}

export class EfpClient {
  private baseUrl: string;

  constructor(baseUrl: string = EFP_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`EFP API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserStats(address: string): Promise<EfpUserStats | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${address}/stats`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching EFP user stats:", error);
      return null;
    }
  }

  async getEnsData(address: string): Promise<EfpEnsData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${address}/ens`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      // The API returns nested ens object, extract the data
      if (data?.ens) {
        return {
          address: data.ens.address,
          ens: data.ens.name,
          avatar: data.ens.avatar,
          name: data.ens.records?.name,
          header: data.ens.records?.header,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching EFP ENS data:", error);
      return null;
    }
  }

  async getFollowers(address: string, limit = 50, offset = 0): Promise<EfpFollower[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${address}/followers?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.followers || [];
    } catch (error) {
      console.error("Error fetching EFP followers:", error);
      return [];
    }
  }

  async getFollowing(address: string, limit = 50, offset = 0): Promise<EfpFollower[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${address}/following?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.following || [];
    } catch (error) {
      console.error("Error fetching EFP following:", error);
      return [];
    }
  }

  async resolveEnsToAddress(ensName: string): Promise<string | null> {
    try {
      // Use viem to resolve ENS names to addresses
      const { createPublicClient, http } = await import("viem");
      const { mainnet } = await import("viem/chains");
      const { normalize } = await import("viem/ens");

      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      const normalizedName = normalize(ensName);
      const address = await publicClient.getEnsAddress({ name: normalizedName });

      return address || null;
    } catch (error) {
      console.error("Error resolving ENS name:", error);
      return null;
    }
  }
}

export const efpClient = new EfpClient();
