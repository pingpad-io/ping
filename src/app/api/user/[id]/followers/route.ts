import { PageSize } from "@lens-protocol/client";
import { fetchFollowers } from "@lens-protocol/client/actions";
import { NextRequest, NextResponse } from "next/server";
import { lensAcountToUser } from "~/components/user/User";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

  try {
    const { client } = await getServerAuth();

    const result = await fetchFollowers(client, {
      cursor,
      pageSize: PageSize.Fifty,
      account: id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
    }

    const followers = result.value;
    const users = followers.items.map((item) => lensAcountToUser(item.follower));

    return NextResponse.json({ data: users, nextCursor: followers.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch followers: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
