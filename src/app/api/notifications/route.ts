import { fetchNotifications } from "@lens-protocol/client/actions";
import type { NextRequest } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";
import { lensNotificationToNative } from "~/utils/lens/converters/notificationConverter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 50;

  try {
    const { sessionClient, isAuthenticated } = await getServerAuth();

    if (!isAuthenticated || !sessionClient) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    try {
      const resultResponse = await fetchNotifications(sessionClient, {
        cursor: cursor || undefined,
        filter: {
          feeds: [{ globalFeed: true }],
        },
      });

      if (resultResponse.isErr()) {
        return new Response(
          JSON.stringify({ error: `Failed to fetch notifications: ${resultResponse.error.message}` }),
          { status: 500 },
        );
      }

      const result = resultResponse.value;
      const notifications = result.items.map(lensNotificationToNative);

      return new Response(
        JSON.stringify({
          data: notifications,
          nextCursor: result.pageInfo.next,
        }),
        { status: 200 },
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return new Response(
        JSON.stringify({ error: `Failed to fetch notifications: ${error.message || "Unknown error"}` }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Notifications API error:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch notifications: ${error.message || "Unknown error"}`,
      }),
      { status: 500 },
    );
  }
}
