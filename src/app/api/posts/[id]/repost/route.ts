import { fetchPost, repost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client, sessionClient } = await getServerAuth();

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

    // Using the new repost method instead of mirrorOnMomoka or mirrorOnchain
    const result = await repost(sessionClient, {
      post: id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: result.error.message, result: false }, { status: 500 });
    }

    // Handle the result based on the new API response structure
    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to repost: ", error.message);
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
