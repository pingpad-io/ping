import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "toggle";

    return NextResponse.json({ result: true, action: "created" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
