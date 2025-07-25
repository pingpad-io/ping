import { type NextRequest, NextResponse } from "next/server";
import { TRENDING_GROUP_ADDRESSES } from "~/constants/trendingGroups";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const page = cursor ? Number(cursor) : 1;
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const hasMore = endIndex < TRENDING_GROUP_ADDRESSES.length;

    return NextResponse.json({
      data: [],
      nextCursor: hasMore ? String(page + 1) : undefined,
    });
  } catch (error) {
    console.error("Error fetching trending groups:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
