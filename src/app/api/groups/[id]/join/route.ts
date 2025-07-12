import { joinGroup } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { client, sessionClient, isAuthenticated } = await getServerAuth();

    if (!isAuthenticated || !sessionClient) {
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    const result = await joinGroup(sessionClient, {
      group: params.id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
    }

    const joinResult = result.unwrapOr(null);
    if (!joinResult) {
      return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: joinResult,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
