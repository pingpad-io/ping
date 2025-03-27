import { PageSize, PostType } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const type = searchParams.get("type") ?? "latest";
  const limitParam = searchParams.get("limit") ?? "25";

  let orderBy;
  switch (type) {
    case "latest":
      orderBy = "CREATED_AT";
      break;
    case "curated":
      orderBy = "CURATED";
      break;
    case "collected":
      orderBy = "COLLECTED";
      break;
    default:
      orderBy = "CREATED_AT";
      break;
  }

  let pageSize;
  switch (limitParam) {
    case "10":
      pageSize = PageSize.Ten;
      break;
    case "50":
      pageSize = PageSize.Fifty;
      break;
    default:
      pageSize = PageSize.Ten;
      break;
  }

  try {
    const { client } = await getServerAuth();


    const result = await fetchPosts(client, {
      filter: {
        postTypes: [PostType.Root],
      },
      cursor,
      pageSize,
    });

    if (result.isErr()) {
      console.error(result.error);
      return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
    }

    const data = result.value;
    const posts = data.items.map(lensItemToPost);

    return new Response(JSON.stringify({ data: posts, nextCursor: data.pageInfo.next }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
