import { PublicationType } from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const type = searchParams.get("type") || "post";

  let publicationType: PublicationType;
  switch (type) {
    case "post":
      publicationType = PublicationType.Post;
      break;
    case "comment":
      publicationType = PublicationType.Comment;
      break;
    case "quote":
      publicationType = PublicationType.Quote;
      break;
    case "repost":
      publicationType = PublicationType.Mirror;
      break;
    default:
      publicationType = PublicationType.Post;
  }

  try {
    const { client, isAuthenticated, profileId } = await getServerAuth();

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = (await client.feed.fetch({ where: { for: profileId }, cursor })).unwrap();

    const posts = data.items.map(lensItemToPost);

    return NextResponse.json({ posts, nextCursor: data.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch feed: ", error);
    return NextResponse.json({ error: `Failed to fetch feed: ${error.message}` }, { status: 500 });
  }
}
