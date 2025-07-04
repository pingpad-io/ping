import type { AccountStats } from "@lens-protocol/client";
import type { User } from "~/components/user/User";
import { efpClient } from "./client";
import { efpToUser } from "./mappers";


export async function getUserByEns(ensName: string, currentUserAddress?: string,
): Promise<{ user: User | null; stats: AccountStats | null }> {
  try {
    const address = await efpClient.resolveEnsToAddress(ensName);
    if (!address) {
      return { user: null, stats: null };
    }

    const [ensData, efpStats] = await Promise.all([efpClient.getEnsData(address), efpClient.getUserStats(address)]);

    let isFollowingMe = false;
    let isFollowedByMe = false;

    if (currentUserAddress) {
      try {
        const [followers, following] = await Promise.all([
          efpClient.getFollowers(address, 1000),
          efpClient.getFollowing(currentUserAddress, 1000),
        ]);

        isFollowingMe = followers.some((f) => f.address.toLowerCase() === currentUserAddress.toLowerCase());
        isFollowedByMe = following.some((f) => f.address.toLowerCase() === address.toLowerCase());
      } catch (error) {
        console.error("Error fetching follow relationships:", error);
      }
    }

    const user = efpToUser(ensData, efpStats, isFollowingMe, isFollowedByMe);

    const stats: AccountStats | null = efpStats
      ? ({
        __typename: "AccountStats",
        id: address,
        feedStats: {
          __typename: "AccountFeedsStats",
          posts: 0,
          comments: 0,
          reposts: 0,
          quotes: 0,
          reacted: 0,
          reactions: 0,
          collects: 0,
          tips: 0,
        },
        graphFollowStats: {
          __typename: "AccountGraphsFollowStats",
          followers: efpStats.followers_count,
          following: efpStats.following_count,
        },
      } as AccountStats)
      : null;

    return { user, stats };
  } catch (error) {
    console.error("Error fetching user by ENS:", error);
    return { user: null, stats: null };
  }
}
