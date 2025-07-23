import type { User } from "@cartel-sh/ui";

interface EnsRecord {
  avatar?: string;
  "com.discord"?: string;
  "com.twitter"?: string;
  description?: string;
  email?: string;
  name?: string;
  "org.telegram"?: string;
  url?: string;
  [key: string]: string | undefined;
}

interface EnsData {
  name: string;
  avatar?: string;
  records?: EnsRecord;
  updated_at?: string;
}

interface EthFollowAccount {
  address: string;
  ens?: EnsData;
}

export function ensAccountToUser(account: EthFollowAccount): User {
  const address = account.address.toLowerCase();
  const ensName = account.ens?.name;
  const avatar = account.ens?.avatar || account.ens?.records?.avatar;
  const description = account.ens?.records?.description;
  
  // Convert ENS records to metadata attributes
  const attributes: Array<{ key: string; value: string }> = [];
  
  if (account.ens?.records) {
    const records = account.ens.records;
    
    // Add website
    if (records.url) {
      attributes.push({ key: "website", value: records.url });
    }
    
    // Add social platforms
    if (records["com.twitter"]) {
      attributes.push({ key: "x", value: `https://x.com/${records["com.twitter"]}` });
    }
    
    if (records["com.discord"]) {
      attributes.push({ key: "discord", value: records["com.discord"] });
    }
    
    if (records["org.telegram"]) {
      attributes.push({ key: "telegram", value: `https://t.me/${records["org.telegram"]}` });
    }
    
    if (records.email) {
      attributes.push({ key: "email", value: records.email });
    }
  }
  
  // Create User object compatible with @cartel-sh/ui
  const user: User = {
    id: address,
    address: address,
    username: ensName || address,
    profilePictureUrl: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
    description: description || null,
    namespace: "ens",
    metadata: attributes.length > 0 ? {
      attributes
    } : undefined
  };
  
  return user;
}

// Helper function to fetch and convert user data
export async function fetchEnsUser(addressOrEns: string): Promise<User | null> {
  try {
    const response = await fetch(
      `https://api.ethfollow.xyz/api/v1/users/${addressOrEns}/account`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data: EthFollowAccount = await response.json();
    return ensAccountToUser(data);
  } catch (error) {
    console.error("Failed to fetch ENS user:", error);
    return null;
  }
}