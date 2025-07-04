import { PageSize } from "@lens-protocol/client";
import { fetchFollowers } from "@lens-protocol/client/actions";
import { NextRequest, NextResponse } from "next/server";
import { lensAcountToUser } from "~/components/user/User";
import { efpClient } from "~/utils/efp/client";
import { efpToUser } from "~/utils/efp/mappers";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
  const isEth = req.nextUrl.searchParams.get("namespace") === "eth";

  try {
    if (isEth) {
      const offset = cursor ? Number.parseInt(cursor) : 0;
      const followers = await efpClient.getFollowers(id, 50, offset);

      const users = await Promise.all(
        followers.map(async (follower) => {
          const [ensData, stats] = await Promise.all([
            efpClient.getEnsData(follower.address),
            efpClient.getUserStats(follower.address),
          ]);
          return efpToUser(ensData, stats);
        }),
      );

      const validUsers = users.filter((user) => user !== null);
      const nextCursor = followers.length === 50 ? (offset + 50).toString() : undefined;

      return NextResponse.json({ data: validUsers, nextCursor }, { status: 200 });
    }
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
