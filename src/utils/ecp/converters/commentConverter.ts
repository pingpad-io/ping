import type { Post } from "@cartel-sh/ui";

// ECP comment structure from the indexer API
interface ECPComment {
  id: string;
  author: string;
  content: string;
  timestamp: number | string; // Can be Unix timestamp or ISO string
  upvotes?: number;
  downvotes?: number;
  replies?: number;
  parentId?: string;
  targetUri?: string;
}

export function ecpCommentToPost(comment: ECPComment): Post {
  console.log(comment)
  const authorAddress = comment.author.toLowerCase();
  const displayName = `${authorAddress.slice(0, 6)}...${authorAddress.slice(-4)}`;

  return {
    id: comment.id,
    author: {
      id: authorAddress,
      address: authorAddress,
      username: displayName, // Will be resolved to ENS on client
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
    },
    metadata: {
      content: comment.content,
      __typename: "TextOnlyMetadata" as const
    },
    createdAt: typeof comment.timestamp === 'number'
      ? new Date(comment.timestamp * 1000) // Convert Unix timestamp to Date
      : new Date(comment.timestamp), // Already ISO string
    updatedAt: typeof comment.timestamp === 'number'
      ? new Date(comment.timestamp * 1000)
      : new Date(comment.timestamp),
    platform: "lens" as const, // Using lens as fallback since ECP isn't in PostPlatform type
    __typename: "Post" as const,
    isEdited: false,
    reactions: {
      Bookmark: 0,
      Collect: 0,
      Comment: comment.replies || 0,
      Repost: 0,
      upvotes: comment.upvotes || 0,
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
      totalReactions: (comment.upvotes || 0) + (comment.replies || 0)
    },
    comments: [], // Replies will be fetched separately
    mentions: undefined
  };
}