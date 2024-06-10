import type { ProfileFragment } from "@lens-protocol/client";
import type { Profile } from "@lens-protocol/react-web";

export type User = {
  id: string;
  name?: string;
  handle: string;
  address: string;
  createdAt?: Date;
  namespace: string;
  description?: string;
  profilePictureUrl?: string;
};

export function lensProfileToUser(profile: Profile | ProfileFragment): User {
  if (!profile) return {} as unknown as User;

  const imageUrl =
    profile?.metadata?.picture?.__typename === "ImageSet"
      ? profile?.metadata?.picture?.optimized?.uri || profile?.metadata?.picture?.raw?.uri
      : profile?.metadata?.picture.image.optimized?.uri || profile?.metadata?.picture?.image.raw?.uri;

  const user = {
    id: profile.id,
    profilePictureUrl: imageUrl,
    address: profile.ownedBy.address,
    createdAt: profile.createdAt as unknown as Date,
    description: profile?.metadata?.bio,
    name: profile?.metadata?.displayName,
    handle: profile.handle?.localName ?? profile.id,
    namespace: profile.handle?.namespace ?? "wallet",
  };

  return user;
}
