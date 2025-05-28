import { fetchPost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { sessionClient } = await getServerAuth();

    if (!sessionClient) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const postResult = await fetchPost(sessionClient, {
      post: id,
    });

    if (postResult.isErr()) {
      return NextResponse.json({ error: "Failed to fetch post", result: false }, { status: 500 });
    }

    const publication = postResult.value;

    // Check if the post is a repost (previously called Mirror)
    if (publication.__typename === "Repost") {
      return NextResponse.json({ error: "Cannot collect a repost publication", result: false }, { status: 400 });
    }

    // Note: client.publication.actions.actOn() is marked as "Coming Soon" in the migration guide
    // For now, we'll return a message indicating this functionality is not yet available

    return NextResponse.json(
      {
        message: "Collect action is not yet available in the new Lens Protocol API",
        postId: id,
      },
      { status: 200 },
    );

    /* 
    // This is the code that would be used once the API is available:
    const result = await actOn(sessionClient, {
      action: {
        simpleCollect: true,
      },
      post: id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: result.error.message, result: false }, { status: 500 });
    }

    const data = result.value;

    const completion = await sessionClient.waitForTransaction({ txId: data.txId });

    if (completion.status === "FAILED") {
      return NextResponse.json({ error: completion.reason, result: false }, { status: 500 });
    }

    if (completion.status === "COMPLETE") {
      return NextResponse.json({ result: true }, { status: 200 });
    }
    */
  } catch (error) {
    console.error("Failed to collect post: ", error.message);
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
