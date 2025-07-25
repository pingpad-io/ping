import type { NextRequest } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");

  try {
    const { isAuthenticated } = await getServerAuth();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const posts: any[] = [];

    return new Response(JSON.stringify({ data: posts, nextCursor: null }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch bookmarks: ${error.message}` }), { status: 500 });
  }
}
