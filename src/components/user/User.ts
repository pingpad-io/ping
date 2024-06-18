import type { ProfileFragment } from "@lens-protocol/client";
import type { Profile, ProfileInterestTypes } from "@lens-protocol/react-web";

export type UserInterests = {
  category: string;
  value: ProfileInterestTypes;
  label: string;
};

export type UserStats = {
  followers: number;
  following: number;
  downvotes: number;
  upvotes: number;
  comments: number;
  posts: number;
  score: number;
};

export type User = {
  id: string;
  name?: string;
  stats: UserStats;
  handle: string;
  address: string;
  namespace: string;
  interests?: UserInterests[];
  createdAt?: Date;
  description?: string;
  profilePictureUrl?: string;
};

export function lensProfileToUser(profile: Profile | ProfileFragment): User {
  if (!profile) return {} as unknown as User;

  const imageUrl =
    profile?.metadata?.picture?.__typename === "ImageSet"
      ? profile?.metadata?.picture?.optimized?.uri || profile?.metadata?.picture?.raw?.uri
      : profile?.metadata?.picture.image.optimized?.uri || profile?.metadata?.picture?.image.raw?.uri;

  const stats = {
    followers: profile.stats.followers,
    following: profile.stats.following,
    downvotes: profile.stats.downvotes,
    upvotes: profile.stats.upvotes,
    comments: profile.stats.comments,
    posts: profile.stats.posts,
    score: profile.stats.lensClassifierScore,
  };

  const interests = parseInterests(profile.interests as ProfileInterestTypes[]);

  const user = {
    id: profile.id,
    profilePictureUrl: imageUrl,
    address: profile.ownedBy.address,
    createdAt: profile.createdAt as unknown as Date,
    description: profile?.metadata?.bio,
    interests,
    name: profile?.metadata?.displayName,
    handle: profile.handle?.localName ?? profile.id,
    namespace: profile.handle?.namespace ?? "wallet",
    stats,
  };

  return user;
}

// Capitalizes each word in a string
export function capitalize(label: string): string {
  return label.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

// Processes raw interest types into structured interests array
export function parseInterests(categories: ProfileInterestTypes[]): UserInterests[] {
  return categories.map((item) => {
    const [category, subcategory] = item.split("__");
    const label = capitalize(subcategory ? subcategory.replace(/_/g, " ") : category.replace(/_/g, " "));
    return { category, value: item, label };
  });
}
