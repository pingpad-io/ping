import type { Account } from "@lens-protocol/client";
import type { ProfileInterestTypes } from "@lens-protocol/react-web";

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

export type UserActions = {
  followed: boolean;
  following: boolean;
  blocked: boolean;
};

export type User = {
  id: string;
  name?: string;
  stats: UserStats;
  handle: string;
  address: string;
  namespace: string;
  actions?: UserActions;
  interests?: UserInterests[];
  createdAt?: Date;
  description?: string;
  profilePictureUrl?: string;
};

export function lensProfileToUser(profile: Account): User {
  if (!profile) return {} as unknown as User;

  const imageUrl = profile?.metadata?.picture;

  //// FIXME: Temporary stats
  const stats = {
    followers: 0,
    following: 0,
    downvotes: 0,
    upvotes: 0,
    comments: 0,
    posts: 0,
    score: 0,
  };

  //// FIXME: Temporary interests
  const interests = [];

  const actions = {
    followed: profile.operations.isFollowedByMe,
    following: profile.operations.isFollowingMe,
    blocked: profile.operations.isBlockedByMe,
  };

  return {
    id: profile.address,
    profilePictureUrl: imageUrl,
    address: profile.owner,
    createdAt: profile.createdAt,
    description: profile?.metadata.bio,
    interests,
    actions,
    name: profile?.metadata.name,
    handle: profile.username.localName,
    namespace: profile.username.namespace.address,
    stats,
  };
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
