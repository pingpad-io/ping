import type { NextRequest } from "next/server";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { client, isAuthenticated, profileId } = await getLensClient();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true }, cursor });

    if (!data.isSuccess()) {
      return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
    }

    const posts = data.unwrap().items.map(lensNotificationToNative);

    return new Response(JSON.stringify({ posts, nextCursor: data.unwrap().pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
