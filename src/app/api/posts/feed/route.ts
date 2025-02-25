import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";
import { fetchPosts, fetchTimeline } from "@lens-protocol/client/actions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;
  const type = searchParams.get("type") || "post";

  // let publicationType: PublicationType;
  // switch (type) {
  //   case "post":
  //     publicationType = PublicationType.Post;
  //     break;
  //   case "comment":
  //     publicationType = PublicationType.Comment;
  //     break;
  //   case "quote":
  //     publicationType = PublicationType.Quote;
  //     break;
  //   case "repost":
  //     publicationType = PublicationType.Mirror;
  //     break;
  //   default:
  //     publicationType = PublicationType.Post;
  // }

  try {
    const { client, sessionClient, isAuthenticated, profileId } = await getServerAuth();
    console.log(client, profileId, isAuthenticated)

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // const data = await fetchTimeline(client, { 
    //   account: profileId,
    //   cursor,
    // })

    const data = await fetchTimeline(client, { 
      account: profileId,
      cursor,
    })

    if (data.isErr()) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const posts = data.value.items.map(lensItemToPost);

    return NextResponse.json({ data: posts, nextCursor: data.value.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch feed: ", error);
    return NextResponse.json({ error: `Failed to fetch feed: ${error.message}` }, { status: 500 });
  }
}
