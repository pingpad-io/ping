import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
