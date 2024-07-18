import { LimitType } from "@lens-protocol/client";
import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const { client, isAuthenticated, profileId } = await getServerAuth();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const data = await client.feed.highlights({
      where: { for: profileId },
      cursor,
      limit: LimitType.TwentyFive,
    });

    if (!data || !data.isSuccess()) {
      return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
    }

    const items = data.unwrap();
    const posts = items.items.map(lensItemToPost);

    return new Response(JSON.stringify({ data: posts, nextCursor: items.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
