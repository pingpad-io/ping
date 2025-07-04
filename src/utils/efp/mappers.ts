import type { User, UserActions } from "~/components/user/User";
import type { EfpEnsData, EfpUserStats } from "./client";

export function efpToUser(
  ensData: EfpEnsData | null,
  _stats: EfpUserStats | null,
  isFollowingMe?: boolean,
  isFollowedByMe?: boolean,
): User | null {
  if (!ensData) return null;

  const actions: UserActions = {
    followed: isFollowedByMe ?? false,
    following: isFollowingMe ?? false,
    blocked: false,
    muted: false,
  };

  return {
    id: ensData.address,
    name: ensData.name || ensData.ens?.replace(".eth", ""),
    handle: ensData.ens || ensData.address,
    address: ensData.address,
    namespace: "eth",
    actions,
    profilePictureUrl: ensData.avatar,
    description: undefined,
    interests: undefined,
    createdAt: undefined,
  };
}

export function formatEnsHandle(handle: string): string {
  if (handle.endsWith(".eth")) {
    return handle;
  }
  return `${handle}.eth`;
}

export function isEnsHandle(handle: string): boolean {
  return handle.endsWith(".eth");
}
