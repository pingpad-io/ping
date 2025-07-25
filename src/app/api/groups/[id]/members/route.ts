import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor") || undefined;

  try {
    return NextResponse.json({
      members: [],
      nextCursor: null,
      hasMore: false,
    });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
