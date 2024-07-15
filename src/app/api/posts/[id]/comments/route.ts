import { LimitType } from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

    const comments = await client.publication.fetchAll({
      where: { commentOn: { id } },
      limit: LimitType.TwentyFive,
      cursor,
    });

    if (!comments.items) {
      throw new Error("No comments found");
    }

    const commentsPosts = comments.items.map((comment) => lensItemToPost(comment));

    return NextResponse.json({ comments: commentsPosts, nextCursor: comments.pageInfo.next }, { status: 200 });
  } catch (error) {
    console.error("Failed to load comments: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
