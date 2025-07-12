import { PageSize } from "@lens-protocol/client";
import { fetchGroupMembers } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor") || undefined;

  try {
    const { client } = await getServerAuth();

    const result = await fetchGroupMembers(client, {
      group: params.id,
      pageSize: PageSize.Ten,
      cursor,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch group members" }, { status: 500 });
    }

    const data = result.unwrapOr(null);
    if (!data) {
      return NextResponse.json({ error: "Failed to fetch group members" }, { status: 500 });
    }

    return NextResponse.json({
      members: data.items,
      nextCursor: data.pageInfo.next,
      hasMore: data.pageInfo.next !== null,
    });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
