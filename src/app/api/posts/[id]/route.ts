import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const { client } = await getServerAuth();

    const lensPost = await client.publication.fetch({
      forId: id,
    });

    const nativePost = lensItemToPost(lensPost);

    return NextResponse.json({ lensPost, nativePost }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
