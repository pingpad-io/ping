import { type NextRequest, NextResponse } from "next/server";
import { API_URLS } from "~/config/api";
import { getDefaultChainId } from "~/config/chains";
import { ecpCommentToPost } from "~/utils/ecp/converters/commentConverter";
import { getServerAuthLight } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

// Pre-rename posts were tagged with "app://flow.talk"; new posts use the rebranded URI.
// The indexer's targetUri filter is single-valued, so the main feed runs both queries in
// parallel and merges. Cursors are encoded as a compound { o, n } pair.
const MAIN_FEED_TARGET_URIS = ["app://flow.talk", "app://paper.flow.industries"] as const;

type MainFeedCursor = { o?: string | null; n?: string | null };

function decodeMainFeedCursor(raw: string | null): MainFeedCursor {
  if (!raw) return {};
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return { o: raw };
  }
}

function encodeMainFeedCursor(c: MainFeedCursor): string | null {
  if (!c.o && !c.n) return null;
  return Buffer.from(JSON.stringify(c)).toString("base64url");
}

function commentTimestamp(c: { createdAt: number | string }): number {
  return typeof c.createdAt === "number" ? c.createdAt : Date.parse(c.createdAt) / 1000;
}

async function fetchEcpPage(params: URLSearchParams) {
  const apiUrl = `${API_URLS.ECP}/api/comments?${params}`;
  const resp = await fetch(apiUrl, { headers: { Accept: "application/json" } });
  if (!resp.ok) {
    throw new Error(`API returned ${resp.status}: ${resp.statusText}`);
  }
  const json = await resp.json();
  return {
    results: (json.results || []) as any[],
    nextCursor: (json.pagination?.hasNext ? json.pagination.endCursor : null) as string | null,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const address = searchParams.get("address");
  const channelId = searchParams.get("channelId") || searchParams.get("channel");
  const feed = searchParams.get("feed");
  const group = searchParams.get("group");
  const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
  const moderationStatus = searchParams.get("moderationStatus");

  const auth = await getServerAuthLight();
  const currentUserAddress = auth.address || "";
  const isMainFeed = !address && !channelId && !feed && !group;

  try {
    console.log("Fetching posts with params:", {
      address,
      channelId,
      feed,
      group,
      limit,
      cursor,
      chainId: getDefaultChainId(),
      moderationStatus,
      isMainFeed,
    });

    const baseParams = new URLSearchParams({
      chainId: getDefaultChainId().toString(),
      limit: limit.toString(),
      sort: "desc",
      mode: address ? "nested" : "flat",
    });
    if (moderationStatus) baseParams.append("moderationStatus", moderationStatus);

    let ecpComments: any[];
    let nextCursor: string | null;

    if (isMainFeed) {
      const compound = decodeMainFeedCursor(cursor);
      const upstreamCursors = [compound.o, compound.n] as const;
      const streams = await Promise.all(
        MAIN_FEED_TARGET_URIS.map((uri, i) => {
          const params = new URLSearchParams(baseParams);
          params.set("targetUri", uri);
          if (upstreamCursors[i]) params.set("cursor", upstreamCursors[i] as string);
          return fetchEcpPage(params);
        }),
      );

      const seen = new Set<string>();
      const merged: any[] = [];
      for (const c of streams.flatMap((s) => s.results)) {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          merged.push(c);
        }
      }
      merged.sort((a, b) => commentTimestamp(b) - commentTimestamp(a));
      ecpComments = merged.slice(0, limit);

      nextCursor = encodeMainFeedCursor({ o: streams[0].nextCursor, n: streams[1].nextCursor });
    } else {
      const params = new URLSearchParams(baseParams);
      if (cursor) params.set("cursor", cursor);
      if (address) {
        params.set("author", address);
      } else {
        const targetChannelId = channelId || feed || group;
        if (targetChannelId) params.set("channelId", targetChannelId);
      }
      const page = await fetchEcpPage(params);
      ecpComments = page.results;
      nextCursor = page.nextCursor;
    }

    const posts = await Promise.all(
      ecpComments.map((comment: any) => ecpCommentToPost(comment, { currentUserAddress, includeReplies: true })),
    );

    const filteredPosts = posts.filter((post) => {
      const content = post.metadata?.content;
      return content !== "[deleted]";
    });

    return NextResponse.json(
      {
        data: filteredPosts,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch posts: ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("id");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const auth = await getServerAuthLight();
  const currentUserAddress = auth.address;

  if (!currentUserAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Note: Actual deletion happens on the blockchain via the delete hook
  // This endpoint just validates the request and returns success
  // The frontend will handle the actual blockchain transaction

  return NextResponse.json({ success: true, message: "Post deletion initiated" }, { status: 200 });
}
