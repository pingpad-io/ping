import { PageSize } from "@lens-protocol/client";
import { fetchFollowing } from "@lens-protocol/client/actions";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";
import { lensAccountToUser } from "~/utils/lens/converters/userConverter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

  try {
    const { client } = await getServerAuth();

    const result = await fetchFollowing(client, {
      cursor,
      pageSize: PageSize.Fifty,
      account: id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
    }

    const following = result.value;
    const users = following.items.map((item) => lensAccountToUser(item.following));

    return NextResponse.json({ data: users, nextCursor: following.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch following: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
