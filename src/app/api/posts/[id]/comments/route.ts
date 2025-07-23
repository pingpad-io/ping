import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { postIdToEcpTarget } from "~/utils/ecp/targetConverter";

export const dynamic = "force-dynamic";

// ECP API endpoint
const ECP_API_URL = "https://api.ethcomments.xyz";

// Support multiple chains: Base and Mainnet
const SUPPORTED_CHAIN_IDS = [8453, 1];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
  
  // Support cursor-based pagination for Feed component
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    // Convert post ID to ECP target URI
    const targetUri = postIdToEcpTarget(id);
    
    // Use direct API call to bypass SDK validation issues
    const queryParams = new URLSearchParams({
      targetUri,
      chainId: SUPPORTED_CHAIN_IDS.join(','),
      limit: limit.toString(),
      sort: 'desc',
      mode: 'nested'
    });
    
    if (cursor) queryParams.append('cursor', cursor);
    
    const apiResponse = await fetch(
      `${ECP_API_URL}/api/comments?${queryParams}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const response = await apiResponse.json();

    // The response has a results array
    const ecpComments = response.results || [];
    
    // Convert ECP comments to Post format
    const comments = ecpComments.map((comment: any) => ecpCommentToPost({
      id: comment.id,
      author: comment.author.address || comment.author, // Handle both nested and flat author
      content: comment.content,
      timestamp: comment.createdAt,
      upvotes: comment.reactions?.upvotes || 0,
      downvotes: comment.reactions?.downvotes || 0,
      replies: comment.replies?.count || 0,
      parentId: comment.parentId,
      targetUri: comment.targetUri
    }));
    
    // Use the cursor from the response for pagination
    const nextCursor = response.pagination?.hasNext ? response.pagination.endCursor : null;

    return NextResponse.json(
      {
        comments,
        nextCursor,
        data: comments, // For Feed component compatibility
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to load comments from ECP: ", error);
    return NextResponse.json({ error: `Failed to fetch comments: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}