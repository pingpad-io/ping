/**
 * Convert a post ID to an ECP target identifier
 * ECP uses URL-like identifiers for comment targets
 */
export function postIdToEcpTarget(postId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paper.flow.industries";
  return `${baseUrl}/p/${postId}`;
}

/**
 * Extract post ID from an ECP target
 */
export function ecpTargetToPostId(target: string): string | null {
  const match = target.match(/\/p\/(.+)$/);
  return match ? match[1] : null;
}
