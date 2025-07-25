import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
