import { bookmarkPost, fetchPost, undoBookmarkPost } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client, sessionClient } = await getServerAuth();

    if (!sessionClient) {
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
      return NextResponse.json({ error: "Cannot bookmark a share publication" }, { status: 400 });
    }

    const bookmarkExists = publication.operations.hasBookmarked;

    try {
      let result;
      if (bookmarkExists) {
        result = await undoBookmarkPost(sessionClient, {
          post: publication.id,
        });
      } else {
        result = await bookmarkPost(sessionClient, {
          post: publication.id,
        });
      }

      if (result.isErr()) {
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      }

      return NextResponse.json({ result: !bookmarkExists }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to bookmark post: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
