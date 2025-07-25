import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuth } from "~/utils/getServerAuth";
import { API_URLS } from "~/config/api";

export const dynamic = "force-dynamic";
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
      `${API_URLS.ECP}/api/comments?${queryParams}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const response = await apiResponse.json();
    const ecpComments = response.results || [];

    const posts = await Promise.all(ecpComments.map((comment: any) => ecpCommentToPost(comment, currentUserAddress)));

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