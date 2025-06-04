import { PostReferenceType } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";
import { PageSize } from "@lens-protocol/react";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const depthParam = req.nextUrl.searchParams.get("depth");
  const maxDepth = depthParam ? Number(depthParam) : Number.POSITIVE_INFINITY;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

    const startResult = await fetchPost(client, { post: id });
    if (startResult.isErr()) {
      return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }

    const startPost = lensItemToPost(startResult.value);
    if (!startPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let rootId = startPost.id;
    let parentId = startPost.commentOn?.id ?? startPost.quoteOn?.id;
    while (parentId) {
      const parentRes = await fetchPost(client, { post: parentId });
      if (parentRes.isErr()) break;
      const parent = lensItemToPost(parentRes.value);
      if (!parent) break;
      rootId = parent.id;
      parentId = parent.commentOn?.id ?? parent.quoteOn?.id;
    }

    const thread: any[] = [];
    let current = startPost;
    let hasMore = false;
    let depth = 0;

    while (depth !== maxDepth) {
      const references = await fetchPostReferences(client, {
        referenceTypes: [PostReferenceType.CommentOn],
        referencedPost: current.id,
        pageSize: PageSize.Ten,
      });

      if (references.isErr()) break;
      const items = references.value.items.map((item) => lensItemToPost(item));
      const next = items.find((p) => p?.author.address === startPost.author.address);
      if (!next) break;
      thread.push(next);
      current = next;
      depth += 1;
    }

    // check if there are more posts beyond the limit
    if (maxDepth !== Number.POSITIVE_INFINITY) {
      const references = await fetchPostReferences(client, {
        referenceTypes: [PostReferenceType.CommentOn],
        referencedPost: current.id,
        pageSize: PageSize.Ten,
      });
      if (references.isOk()) {
        const items = references.value.items.map((item) => lensItemToPost(item));
        const next = items.find((p) => p?.author.address === startPost.author.address);
        if (next) {
          hasMore = true;
        }
      }
    }

    return NextResponse.json({ thread, rootId, hasMore }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to load thread: ", error);
    return NextResponse.json({ error: `Failed to load thread: ${error.message}` }, { status: 500 });
  }
}
