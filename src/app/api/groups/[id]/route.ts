import { fetchGroup } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { client } = await getServerAuth();

    const result = await fetchGroup(client, {
      group: params.id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const group = result.unwrapOr(null);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...group,
      isBanned: group.operations?.isBanned || false,
      canJoin: group.operations?.canJoin?.__typename === "GroupOperationValidationPassed" || false,
      canLeave: group.operations?.canLeave?.__typename === "GroupOperationValidationPassed" || false,
      canPost: group.feed?.operations?.canPost?.__typename === "FeedOperationValidationPassed" || false,
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
