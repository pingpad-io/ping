import type { Account } from "@lens-protocol/client";

export type UserInterests = {
  category: string;
  value: string;
  label: string;
};

export type UserActions = {
  followed: boolean;
  following: boolean;
  blocked: boolean;
  muted: boolean;
};

export type UserMetadataAttribute = {
  key: string;
  value: string;
};

export type User = {
  id: string;
  name?: string;
  handle: string;
  address: string;
  namespace: string;
  actions?: UserActions;
  interests?: UserInterests[];
  createdAt?: Date;
  description?: string;
  profilePictureUrl?: string;
  metadata?: {
    attributes?: UserMetadataAttribute[];
  };
};

export function lensAcountToUser(account: Account): User {
  if (!account) return {} as unknown as User;

  const imageUrl = account?.metadata?.picture;

  const actions = {
    followed: account?.operations?.isFollowedByMe,
    following: account?.operations?.isFollowingMe,
    blocked: account?.operations?.isBlockedByMe,
    muted: account?.operations?.isMutedByMe,
  };

  const attributes = account?.metadata?.attributes?.map((attr) => ({
    key: attr.key,
    value: attr.value,
  }));

  return {
    id: account.address,
    profilePictureUrl: imageUrl,
    address: account.address,
    createdAt: account.createdAt,
    description: account?.metadata?.bio,
    actions,
    name: account?.metadata?.name,
    handle: account.username?.localName,
    namespace: account.username?.namespace?.address,
    metadata: {
      attributes,
    },
  };
}

export function capitalize(label: string): string {
  return label.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function parseInterests(categories: string[]): UserInterests[] {
  return categories.map((item) => {
    const [category, subcategory] = item.split("__");
    const label = capitalize(subcategory ? subcategory.replace(/_/g, " ") : category.replace(/_/g, " "));
    return { category, value: item, label };
  });
}
