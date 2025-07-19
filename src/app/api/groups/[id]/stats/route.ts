import { fetchGroupStats } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { client } = await getServerAuth();

    const result = await fetchGroupStats(client, {
      group: params.id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch group stats" }, { status: 500 });
    }

    const data = result.unwrapOr(null);
    if (!data) {
      return NextResponse.json({ error: "Failed to fetch group stats" }, { status: 500 });
    }

    return NextResponse.json({
      totalMembers: data.totalMembers,
    });
  } catch (error) {
    console.error("Error fetching group stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
