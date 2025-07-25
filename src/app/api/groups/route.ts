import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("q") || "";
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor") || undefined;

  try {
    return NextResponse.json({
      data: [],
      nextCursor: null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
