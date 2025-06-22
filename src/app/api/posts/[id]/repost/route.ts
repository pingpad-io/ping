import { PostReferenceType, postId } from "@lens-protocol/client";
import { deletePost, fetchPost, fetchPostReferences, repost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    let action = body.action || "toggle";
    const { client, sessionClient, user } = await getServerAuth();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const publicationResult = await fetchPost(client, {
      post: id,
    });

    if (publicationResult.isErr()) {
      return NextResponse.json({ error: publicationResult.error.message }, { status: 500 });
    }

    const publication = publicationResult.value;
    if (publication.__typename === "Repost") {
      return NextResponse.json({ error: "Cannot repost a share publication", result: false }, { status: 400 });
    }
    const referencesResult = await fetchPostReferences(client, {
      referencedPost: postId(id),
      referenceTypes: [PostReferenceType.RepostOf],
      authors: [user.address],
    });

    const hasExistingRepost = referencesResult.isOk() && referencesResult.value.items.length > 0;

    if (action === "toggle") {
      // Toggle behavior: delete if exists, create if not
      if (hasExistingRepost) {
        const existingRepost = referencesResult.value.items[0];
        const deleteResult = await deletePost(sessionClient, {
          post: existingRepost.id,
        });

        if (deleteResult.isErr()) {
          return NextResponse.json({ error: deleteResult.error.message, result: false }, { status: 500 });
        }
        return NextResponse.json({ result: true, action: "deleted" }, { status: 200 });
      }
      // No existing repost, create one
      action = "create";
    }

    if (action === "delete" && hasExistingRepost) {
      const existingRepost = referencesResult.value.items[0];
      const deleteResult = await deletePost(sessionClient, {
        post: existingRepost.id,
      });

      if (deleteResult.isErr()) {
        console.error("[REPOST] Failed to delete repost:", deleteResult.error.message);
        return NextResponse.json({ error: deleteResult.error.message, result: false }, { status: 500 });
      }
      return NextResponse.json({ result: true, action: "deleted" }, { status: 200 });
    }

    if (action === "create" || (action === "toggle" && !hasExistingRepost)) {
      const result = await repost(sessionClient, {
        post: id,
      });

      if (result.isErr()) {
        return NextResponse.json({ error: result.error.message, result: false }, { status: 500 });
      }

      return NextResponse.json({ result: true, action: "created" }, { status: 200 });
    }

    // If we get here, something unexpected happened
    return NextResponse.json({ error: "Invalid action or state", result: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
