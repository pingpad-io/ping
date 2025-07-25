import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

const ECP_API_URL = "https://api.ethcomments.xyz";
const SUPPORTED_CHAIN_IDS = [8453, 1];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");
  const author = searchParams.get("author") || undefined;

  const { address: currentUserAddress } = await getServerAuth();

  try {
    const queryParams = new URLSearchParams({
      chainId: SUPPORTED_CHAIN_IDS.join(','),
      limit: limit.toString(),
      sort: 'desc',
      mode: 'flat'
    });
    
    if (cursor) queryParams.append('cursor', cursor);
    if (author) queryParams.append('author', author);
    
    const apiResponse = await fetch(
      `${ECP_API_URL}/api/comments?${queryParams}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const response = await apiResponse.json();
    const ecpComments = response.results || [];

    const posts = await Promise.all(ecpComments.map((comment: any) => ecpCommentToPost({
      id: comment.id,
      author: comment.author.address || comment.author, // Handle both nested and flat author
      content: comment.content,
      timestamp: comment.createdAt,
      upvotes: comment.reactions?.upvotes || 0,
      downvotes: comment.reactions?.downvotes || 0,
      replies: comment.replies?.count || 0,
      parentId: comment.parentId,
      targetUri: comment.targetUri
    }, currentUserAddress)));

    // Use the cursor from the response for pagination
    const nextCursor = response.pagination?.hasNext ? response.pagination.endCursor : null;

    return NextResponse.json({
      data: posts,
      nextCursor
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch feed: ", error);
    return NextResponse.json({ error: `Failed to fetch feed: ${error.message}` }, { status: 500 });
  }
}