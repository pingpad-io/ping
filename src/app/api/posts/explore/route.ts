import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuth } from "~/utils/getServerAuth";
import { API_URLS } from "~/config/api";

export const dynamic = "force-dynamic";
const SUPPORTED_CHAIN_IDS = [8453, 1];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || "10");
  
  const { address: currentUserAddress } = await getServerAuth();

  try {
    // Use direct API call to bypass SDK validation issues
    const queryParams = new URLSearchParams({
      chainId: SUPPORTED_CHAIN_IDS.join(','),
      limit: limit.toString(),
      sort: 'desc',
      mode: 'flat'
    });
    
    if (cursor) queryParams.append('cursor', cursor);
    
    const apiResponse = await fetch(
      `${API_URLS.ECP}/api/comments?${queryParams}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const response = await apiResponse.json();

    // The response has a results array
    const ecpComments = response.results || [];
    
    // Convert ECP comments to Post format
    const posts = await Promise.all(ecpComments.map((comment: any) => ecpCommentToPost(comment, currentUserAddress)));
    
    // Use the cursor from the response for pagination
    const nextCursor = response.pagination?.hasNext ? response.pagination.endCursor : null;

    return NextResponse.json({ 
      data: posts, 
      nextCursor 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch explore posts: ", error);
    return NextResponse.json({ error: `Failed to fetch explore posts: ${error.message}` }, { status: 500 });
  }
}