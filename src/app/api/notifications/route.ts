import type { NextRequest } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 50;

  try {
    const {  isAuthenticated } = await getServerAuth();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    return new Response(
      JSON.stringify({
        data: [],
        nextCursor: null,
      }),
      { status: 200 },
    );
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
