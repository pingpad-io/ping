import { LensClient, production } from "@lens-protocol/client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle");
  if (!handle) return Response.json({}, { status: 400, statusText: "Invalid handle provided" });

  const lens = new LensClient({ environment: production });

  const feed = await lens.feed.fetch({ where: { for: handle } });

  return Response.json(feed, { status: 200 });
}
