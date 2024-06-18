import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("id") || undefined;

  try {
    const { client } = await getLensClient();

    const lensPost = await client.publication.fetch({
      forId: postId,
    });

    const nativePost = lensItemToPost(lensPost);

    return NextResponse.json({ lensPost, nativePost }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
