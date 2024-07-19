import type { NextRequest } from "next/server";
import { lensNotificationToNative } from "~/components/notifications/Notification";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { client, isAuthenticated } = await getServerAuth();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true }, cursor });

    if (!data.isSuccess()) {
      return new Response(JSON.stringify({ error: "Failed to fetch notifications" }), { status: 500 });
    }

    const items = data.unwrap().items;
    const notifications = items.map(lensNotificationToNative);

    return new Response(JSON.stringify({ data: notifications, nextCursor: data.unwrap().pageInfo.next }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch notifications: ${error.message}` }), { status: 500 });
  }
}
