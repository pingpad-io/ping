import type { NextRequest } from "next/server";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { client, isAuthenticated } = await getLensClient();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await client.publication.bookmarks.fetch({ cursor });

    if (!data.isSuccess()) {
      return new Response(JSON.stringify({ error: "Failed to fetch bookmarks" }), { status: 500 });
    }

    const posts = data.unwrap().items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: data.unwrap().pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch bookmarks: ${error.message}` }), { status: 500 });
  }
}
