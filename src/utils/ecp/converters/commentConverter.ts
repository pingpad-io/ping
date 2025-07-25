import type { Post } from "@cartel-sh/ui";
import { fetchEnsUser } from "~/utils/ens/converters/userConverter";

// ECP comment structure from the indexer API
export interface ECPComment {
  id: string;
  author: {
    address?: string;
  } | string;
  content: string;
  createdAt: number | string;
  reactions?: {
    upvotes?: number;
    downvotes?: number;
  };
  replies?: {
    count?: number;
  };
  parentId?: string;
  targetUri?: string;
}

export async function ecpCommentToPost(comment: ECPComment, currentUserAddress?: string): Promise<Post> {
  
  // Handle both nested author object and flat author string
  const authorAddress = (typeof comment.author === 'string' 
    ? comment.author 
    : comment.author.address || ''
  ).toLowerCase();
  
  const displayName = `${authorAddress.slice(0, 6)}...${authorAddress.slice(-4)}`;
  
  const ensUser = await fetchEnsUser(authorAddress, currentUserAddress);
  
  const author = ensUser || {
    id: authorAddress,
    address: authorAddress,
    username: displayName, 
    namespace: "ens",
    profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${authorAddress}`,
    description: null,
    actions: {
      followed: false,
      following: false,
      blocked: false,
      muted: false
    },
    stats: {
      following: 0,
      followers: 0
    }
  };

  const timestamp = comment.createdAt;
  const createdAt = typeof timestamp === 'number'
    ? new Date(timestamp * 1000) // Convert Unix timestamp to Date
    : new Date(timestamp); // Already ISO string

  return {
    id: comment.id,
    author,
    metadata: {
      content: comment.content,
      __typename: "TextOnlyMetadata" as const
    },
    createdAt,
    updatedAt: createdAt,
    platform: "lens" as const, 
    __typename: "Post" as const,
    isEdited: false,
    reactions: {
      Bookmark: 0,
      Collect: 0,
      Comment: comment.replies?.count || 0,
      Repost: 0,
      upvotes: comment.reactions?.upvotes || 0,
      isUpvoted: false,
      isBookmarked: false,
      isCollected: false,
      isReposted: false,
      canCollect: false,
      canComment: true,
      canRepost: true,
      canQuote: true,
      canDecrypt: false,
      canEdit: false,
      totalReactions: (comment.reactions?.upvotes || 0) + (comment.replies?.count || 0)
    },
    comments: [], // Replies will be fetched separately
    mentions: undefined
  };
}