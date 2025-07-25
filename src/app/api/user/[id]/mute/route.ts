import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
