import { evmAddress } from "@lens-protocol/client";
import { unblockAccount } from "@lens-protocol/client/actions";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { sessionClient } = await getServerAuth();

  if (!sessionClient) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const result = await unblockAccount(sessionClient, { account: evmAddress(id) });

  if (result.isErr()) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
