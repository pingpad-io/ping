import { LimitType } from "@lens-protocol/client";
import { PublicationType } from "@lens-protocol/client";
import type { NextRequest } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const profileId = searchParams.get("id");

  try {
    const { client } = await getLensClient();

    const data = await client.publication
      .fetchAll({
        where: { from: [profileId], publicationTypes: [PublicationType.Post] },
        cursor,
        limit: LimitType.Ten,
      })
      .catch(() => {
        throw new Error(`☆⌒(>。<) Couldn't get user posts`);
      });

    const posts = data.items.map(lensItemToPost);

    return new Response(JSON.stringify({ posts, nextCursor: data.pageInfo.next }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch posts: ${error.message}` }), { status: 500 });
  }
}
