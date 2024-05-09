import { ProfileFragment } from "@lens-protocol/client";
import { Profile } from "@lens-protocol/react-web";

export type User = {
  id: string;
  name?: string;
  handle: string;
  address: string;
  namespace: string;
  description?: string;
  profilePictureUrl?: string;
};

export function lensProfileToUser(profile: Profile | ProfileFragment): User {
  const imageUrl =
    profile?.metadata?.picture?.__typename === "ImageSet"
      ? profile?.metadata?.picture?.optimized?.uri || profile?.metadata?.picture?.raw?.uri
      : profile?.metadata?.picture.image.optimized?.uri || profile?.metadata?.picture?.image.raw?.uri;

  return {
    id: profile.id,
    profilePictureUrl: imageUrl,
    address: profile.ownedBy.address,
    name: profile?.metadata?.displayName,
    handle: profile.handle?.localName ?? profile.id,
    namespace: profile.handle?.namespace ?? "wallet",
  };
}
