import { ExplorePublicationType, ExplorePublicationsOrderByType, LimitType } from "@lens-protocol/client";
import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const type = searchParams.get("type") ?? "latest";

  let orderBy: ExplorePublicationsOrderByType;
  switch (type) {
    case "latest":
      orderBy = ExplorePublicationsOrderByType.Latest;
      break;
    case "curated":
      orderBy = ExplorePublicationsOrderByType.LensCurated;
      break;
    case "collected":
      orderBy = ExplorePublicationsOrderByType.TopCollectedOpenAction;
      break;
    default:
      orderBy = ExplorePublicationsOrderByType.Latest;
      break;
  }

  try {
    const { client, isAuthenticated } = await getServerAuth();

    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const data = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy,
      cursor,
      limit: LimitType.TwentyFive,
    });

    const posts = data.items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: data.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
