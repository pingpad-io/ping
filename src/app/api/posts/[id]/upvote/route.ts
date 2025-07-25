import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to upvote post: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
