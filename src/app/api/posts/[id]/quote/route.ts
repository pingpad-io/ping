import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const body = await request.json();
    const { contentUri } = body;

    if (!contentUri || typeof contentUri !== "string") {
      return NextResponse.json({ error: "ContentUri is required" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result: {},
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create quote" },
      { status: 500 },
    );
  }
}
