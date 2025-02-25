import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import type { NextRequest } from "next/server";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { sessionClient, isAuthenticated } = await getServerAuth();

    if (!isAuthenticated || !sessionClient) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await fetchPostBookmarks(sessionClient, { cursor, pageSize: 25 });

    if (data.isErr()) {
      return new Response(JSON.stringify({ error: "Failed to fetch bookmarks" }), { status: 500 });
    }

    const posts = data.value.items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: data.value.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch bookmarks: ${error.message}` }), { status: 500 });
  }
}
