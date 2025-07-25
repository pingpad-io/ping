import { type NextRequest, NextResponse } from "next/server";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuth } from "~/utils/getServerAuth";
import { API_URLS } from "~/config/api";

export const dynamic = "force-dynamic";
const DEFAULT_CHAIN_ID = 8453; // Base

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { address: currentUserAddress } = await getServerAuth();

  try {
    const graphqlQuery = {
      query: `query GetComment($id: String!) { 
        comment(id: $id) { 
          id app author channelId commentType content chainId 
          deletedAt logIndex metadata hookMetadata parentId 
          targetUri txHash moderationStatus moderationStatusChangedAt 
          moderationClassifierResult moderationClassifierScore 
          createdAt updatedAt revision zeroExSwap references 
          reactionCounts replies { totalCount } 
        } 
      }`,
      variables: { id }
    };

    const apiResponse = await fetch(`${API_URLS.ECP}/graphql`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(graphqlQuery)
    });

    if (!apiResponse.ok) {
      throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
    }

    const response = await apiResponse.json();
    
    if (!response.data?.comment) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = response.data.comment;
    
    // Transform GraphQL response to match REST API format
    const transformedComment = {
      ...comment,
      createdAt: new Date(parseInt(comment.createdAt)).toISOString(),
      updatedAt: new Date(parseInt(comment.updatedAt)).toISOString(),
      moderationStatusChangedAt: comment.moderationStatusChangedAt ? new Date(parseInt(comment.moderationStatusChangedAt)).toISOString() : null,
      author: { address: comment.author },
      reactions: comment.reactionCounts || {},
      replies: { count: comment.replies?.totalCount || 0 }
    };
    
    // Convert ECP comment to Post format
    const post = await ecpCommentToPost(transformedComment, currentUserAddress);

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
