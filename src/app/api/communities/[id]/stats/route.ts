import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Implement actual stats fetching from ECP
    // For now, return mock data
    return NextResponse.json({
      totalMembers: 0
    });
  } catch (error) {
    console.error("Failed to fetch community stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch community stats" },
      { status: 500 }
    );
  }
}