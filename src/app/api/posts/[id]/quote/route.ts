import { postId } from "@lens-protocol/client";
import { post as createPost, fetchPost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { client, sessionClient } = await getServerAuth();
    const { id } = await context.params;

    const body = await request.json();
    const { contentUri } = body;

    if (!contentUri || typeof contentUri !== "string") {
      return NextResponse.json({ error: "ContentUri is required" }, { status: 400 });
    }

    const targetPostResult = await fetchPost(client, { post: postId(id) });
    if (targetPostResult.isErr()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const targetPost = targetPostResult.value;
    if (targetPost.__typename !== "Post") {
      return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
    }

    if (!targetPost.operations.canQuote) {
      return NextResponse.json({ error: "You cannot quote this post" }, { status: 403 });
    }

    const result = await createPost(sessionClient, {
      contentUri: contentUri,
      quoteOf: {
        post: postId(id),
      },
    });

    if (result.isOk()) {
      return NextResponse.json({
        success: true,
        result: result.value,
      });
    }

    return NextResponse.json(
      {
        error: result.error?.message || "Failed to create quote",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create quote" },
      { status: 500 },
    );
  }
}
