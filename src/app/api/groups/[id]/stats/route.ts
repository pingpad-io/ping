import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      totalMembers: 0,
    });
  } catch (error) {
    console.error("Error fetching group stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
