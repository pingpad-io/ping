import { CommentFields, QuoteFields } from "@lens-protocol/api-bindings";
import { AnyPublication, Comment, FeedItem, Mirror, Post, Profile, Quote } from "@lens-protocol/react-web";

export type Post = {
  id: string;
  platform: "lens" | "farcaster";
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  reply?: Post;
  reactions: Reaction[];
  comments: Post[];
  metadata: any;
};

export type ReactionType = "UPVOTE" | "DOWNVOTE";

export type Reaction = {
  createdAt?: Date;
  type: ReactionType;
  by: User;
};

export type User = {
  id: string;
  name?: string;
  handle: string;
  profilePictureUrl?: string;
};

export function lensItemToPost(publication: AnyPublication | FeedItem): Post {
  switch (publication.__typename) {
    case "FeedItem":
      return lensFeedItemToPost(publication);
    case "Post":
      return lensPostToPost(publication);
    case "Comment":
      return lensCommentToPost(publication);
    case "Quote":
      return lensQuoteToPost(publication);
    case "Mirror":
      return lensMirrorToPost(publication);
    default:
      return null;
  }
}

export function lensPostToPost(post): Post {}
export function lensCommentToPost(comment: Comment): Post {}
export function lensQuoteToPost(quote: Quote): Post {}
export function lensMirrorToPost(mirror: Mirror): Post {
  return {
    id: mirror.id,
    platform: "lens",
    content: mirror.mirrorOn.
    author: lensProfileToUser(mirror.by),

}
}


export function lensFeedItemToPost(publication: FeedItem | AnyPublication) {
  // metadata: ArticleMetadataV3 | AudioMetadataV3 | CheckingInMetadataV3 | EmbedMetadataV3 | EventMetadataV3 | ImageMetadataV3 |
  // LinkMetadataV3 | LiveStreamMetadataV3 | MintMetadataV3 | SpaceMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3 |
  // ThreeDMetadataV3 | TransactionMetadataV3 | VideoMetadataV3;


  let root: CommentFields | Post | QuoteFields;
  switch (publication.__typename) {
    case "FeedItem":
      root = publication.root
      break
    case "Post":
      root = publication
      break
    case "Comment":
      root = publication.root
      break
    case "Quote":
      root = publication.quoteOn
      break
    case "Mirror":
      root = publication.mirrorOn
      break
    default:
      return null;
  }
  if (!root.by.metadata || root.metadata.__typename !== "TextOnlyMetadataV3") {
    return null;
  }

  const reactions: Reaction[] = root.__typename === "Comment" ? [] : root.reactions.map((reaction) => ({
    createdAt: reaction.createdAt as unknown as Date,
    type: reaction.reaction,
    by: lensProfileToUser(reaction.by),
  })): [];

  const author = lensProfileToUser(root.root.by);

  const comments: Post[] = root.comments.map((comment) => ({
    id: comment.id as string,
    author: lensProfileToUser(comment.by),
    content: comment.metadata.__typename === "TextOnlyMetadataV3" ? comment.metadata.content : "",
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.createdAt), // NOT IMPLEMENTED YET
    comments: [],
    reactions: [],
    metadata: comment.metadata,
    platform: "lens",
  }));

  const createdAt = new Date(root.root.createdAt);

  if (root.root.__typename === "Post") {
    return {
      id: root.root.id as string,
      platform: "lens",
      author,
      reactions,
      comments,
      metadata: root.root.metadata,
      content: root.root.metadata.content,
      createdAt,
      updatedAt: createdAt, // NOT IMPLEMENTED YET
    } as Post;
  }
}

export function lensProfileToUser(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.metadata.displayName,
    profilePictureUrl:
      profile.metadata.picture.__typename === "ImageSet"
        ? profile.metadata?.picture?.optimized?.uri
        : profile.metadata?.picture?.image.optimized?.uri,
    handle: profile.handle?.fullHandle ?? profile.handle.id,
  };
}
