import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";

export const dynamic = "force-dynamic";

// ECP API endpoint
const ECP_API_URL = "https://api.ethcomments.xyz";

// Support multiple chains: Base and Mainnet
const SUPPORTED_CHAIN_IDS = [8453, 1];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const type = searchParams.get("type") || "post";
  const address = searchParams.get("address") || undefined;
  const group = searchParams.get("group") || undefined;
  const feed = searchParams.get("feed") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // Log the request parameters for debugging
    console.log("Fetching posts with params:", {
      address,
      type,
      limit,
      cursor,
      chainId: SUPPORTED_CHAIN_IDS
    });

    // In ECP, all posts are comments
    // We'll filter based on type later if needed
    let response;
    try {
      // Use direct API call to bypass SDK validation issues
      const queryParams = new URLSearchParams({
        chainId: SUPPORTED_CHAIN_IDS.join(','),
        limit: limit.toString(),
        sort: 'desc',
        mode: 'flat'
      });
      
      if (cursor) queryParams.append('cursor', cursor);
      if (address) queryParams.append('author', address);
      
      const apiResponse = await fetch(
        `${ECP_API_URL}/api/comments?${queryParams}`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }
      
      response = await apiResponse.json();
    } catch (ecpError: any) {
      console.error("ECP API Error:", ecpError);
      
      // If it's a Zod validation error, try to fetch the raw response
      if (ecpError.name === 'ZodError') {
        console.log("Zod validation error - the API response has unexpected fields");
        
        // Try a raw fetch to bypass SDK validation
        try {
          const rawResponse = await fetch(
            `${ECP_API_URL}/api/comments?chainId=${SUPPORTED_CHAIN_IDS.join(',')}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}${address ? `&author=${address}` : ''}&sort=desc&mode=flat`,
            { headers: { 'Accept': 'application/json' } }
          );
          
          if (rawResponse.ok) {
            const rawData = await rawResponse.json();
            console.log("Raw API response sample:", JSON.stringify(rawData.results?.[0], null, 2));
          }
        } catch (e) {
          console.error("Failed to fetch raw response:", e);
        }
      }
      
      // Return empty data for now to prevent app crash
      return NextResponse.json({ 
        data: [], 
        nextCursor: null,
        error: "ECP API returned unexpected data format"
      }, { status: 200 }); // Return 200 with empty data instead of 500
    }

    // The response has a results array
    const ecpComments = response.results || [];
    
    // Filter based on type if needed
    let filteredComments = ecpComments;
    
    // In ECP context:
    // - "main" posts are top-level comments (no parentId)
    // - "comment" posts are replies (have parentId)
    switch (type) {
      case "main":
        filteredComments = ecpComments.filter((c: any) => !c.parentId || c.parentId === "0x0000000000000000000000000000000000000000");
        break;
      case "comment":
        filteredComments = ecpComments.filter((c: any) => c.parentId && c.parentId !== "0x0000000000000000000000000000000000000000");
        break;
      // For other types, return all
    }
    
    // Convert ECP comments to Post format
    const posts = filteredComments.map((comment: any) => ecpCommentToPost({
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

    return NextResponse.json({ 
      data: posts, 
      nextCursor 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch posts: ", error);
    return NextResponse.json({ error: `Failed to fetch posts: ${error.message}` }, { status: 500 });
  }
}

// POST method for creating posts would need to be implemented with ECP
export async function POST(req: NextRequest) {
  try {
    // TODO: Implement post creation using ECP
    // This would involve:
    // 1. Creating a comment on a specific target
    // 2. Signing with the user's wallet
    // 3. Submitting to the ECP contract
    
    return NextResponse.json({ 
      error: "Post creation not yet implemented with ECP" 
    }, { status: 501 });
  } catch (error) {
    console.error("Failed to create post: ", error);
    return NextResponse.json({ error: `Failed to create post: ${error.message}` }, { status: 500 });
  }
}

// DELETE method would also need ECP implementation
export async function DELETE(req: NextRequest) {
  try {
    // TODO: Implement post deletion using ECP
    
    return NextResponse.json({ 
      error: "Post deletion not yet implemented with ECP" 
    }, { status: 501 });
  } catch (error) {
    console.error("Failed to delete post: ", error);
    return NextResponse.json({ error: `Failed to delete post: ${error.message}` }, { status: 500 });
  }
}