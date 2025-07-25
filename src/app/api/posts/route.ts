import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

const ECP_API_URL = "https://api.ethcomments.xyz";
const DEFAULT_CHAIN_ID = 8453; // Base

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const address = searchParams.get("address");
  const limit = parseInt(searchParams.get("limit") || "50");

  const { address: currentUserAddress } = await getServerAuth();

  try {
    console.log("Fetching posts with params:", {
      address,
      limit,
      cursor,
      chainId: DEFAULT_CHAIN_ID
    });

    // Build query parameters
    const queryParams = new URLSearchParams({
      chainId: DEFAULT_CHAIN_ID.toString(),
      limit: limit.toString(),
      sort: 'desc',
      mode: address ? 'nested' : 'flat' // Use nested mode for user profiles
    });

    if (cursor) queryParams.append('cursor', cursor);
    if (address) {
      queryParams.append('author', address);
    } else {
      // For main feed, query our app-specific targetUri
      queryParams.append('targetUri', 'app://pingpad');
    }

    const apiUrl = `${ECP_API_URL}/api/comments?${queryParams}`;
    console.log("Fetching from:", apiUrl);

    const apiResponse = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }

    const response = await apiResponse.json();

    const ecpComments = response.results || [];

    // Convert ECP comments to Post format
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
    console.error("Failed to fetch posts: ", error);
    return NextResponse.json({ error: `Failed to fetch posts: ${error.message}` }, { status: 500 });
  }
}