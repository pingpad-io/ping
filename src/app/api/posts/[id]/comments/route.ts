import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { postIdToEcpTarget } from "~/utils/ecp/targetConverter";
import { getServerAuth } from "~/utils/getServerAuth";
import { API_URLS } from "~/config/api";

export const dynamic = "force-dynamic";

// Support multiple chains: Base and Mainnet
const SUPPORTED_CHAIN_IDS = [8453, 1];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

  const { address: currentUserAddress } = await getServerAuth();

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
      `${API_URLS.ECP}/api/comments?${queryParams}`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }
    
    const response = await apiResponse.json();
    const ecpComments = response.results || [];
    
    const comments = await Promise.all(ecpComments.map((comment: any) => ecpCommentToPost(comment, currentUserAddress)));
    
    // Use the cursor from the response for pagination
    const nextCursor = response.pagination?.hasNext ? response.pagination.endCursor : null;

    return NextResponse.json(
      {
        comments,
        nextCursor,
        data: comments, 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to load comments from ECP: ", error);
    return NextResponse.json({ error: `Failed to fetch comments: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}