import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { client, isAuthenticated, profileId } = await getLensClient();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await client.feed.highlights({
      where: { for: profileId },
      cursor,
    });

    if (!data || !data.isSuccess()) {
      return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
    }

    const items = data.unwrap();
    const posts = items.items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: items.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
