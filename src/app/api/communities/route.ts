import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "~/utils/ecp/channels";
import { ecpChannelToCommunity } from "~/utils/ecp/converters/channelConverter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const response = await fetchChannels({
      cursor: cursor || undefined,
      limit,
      sort: 'desc'
    });

    const communities = response.results.map(ecpChannelToCommunity);

    // If there's a search query, filter the results
    const filteredCommunities = q 
      ? communities.filter(community => 
          community.metadata?.name?.toLowerCase().includes(q.toLowerCase()) ||
          community.metadata?.description?.toLowerCase().includes(q.toLowerCase())
        )
      : communities;

    return NextResponse.json({
      data: filteredCommunities,
      nextCursor: response.pagination.hasNext ? response.pagination.endCursor : null
    });
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}