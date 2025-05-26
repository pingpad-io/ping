import {
  UnauthenticatedError,
  PostReactionType,
} from "@lens-protocol/client";
import { addReaction, fetchPost, undoReaction } from "@lens-protocol/client/actions";
import { NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Cannot like a share publication" }, { status: 400 });
    }

    const isUpvoted = publication.operations.hasUpvoted;
    const isDownvoted = publication.operations.hasDownvoted;

    try {
      if (isUpvoted) {
        const result = await undoReaction(sessionClient, {
          post: id,
          reaction: PostReactionType.Upvote,
        });
        
        if (result.isErr()) {
          return NextResponse.json({ error: result.error.message }, { status: 500 });
        }
      } else {
        if (isDownvoted) {
          const result = await undoReaction(sessionClient, {
            post: id,
            reaction: PostReactionType.Downvote,
          });
        }
        
        const result = await addReaction(sessionClient, {
          post: id,
          reaction: PostReactionType.Upvote,
        });
        
        if (result.isErr()) {
          return NextResponse.json({ error: result.error.message }, { status: 500 });
        }
      }

      return NextResponse.json({ result: !isUpvoted }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to upvote post: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
