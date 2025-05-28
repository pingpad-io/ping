import { PostReactionType, UnauthenticatedError } from "@lens-protocol/client";
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
      return NextResponse.json({ error: "Cannot downvote a share publication" }, { status: 400 });
    }

    const isDownvoted = publication.operations.hasDownvoted;
    const isUpvoted = publication.operations.hasUpvoted;

    try {
      if (isDownvoted) {
        const result = await undoReaction(sessionClient, {
          post: id,
          reaction: PostReactionType.Downvote,
        });

        if (result.isErr()) {
          return NextResponse.json({ error: result.error.message }, { status: 500 });
        }
      } else {
        if (isUpvoted) {
          const upvoteResult = await undoReaction(sessionClient, {
            post: id,
            reaction: PostReactionType.Upvote,
          });

          if (upvoteResult.isErr()) {
            return NextResponse.json({ error: upvoteResult.error.message }, { status: 500 });
          }
        }

        const result = await addReaction(sessionClient, {
          post: id,
          reaction: PostReactionType.Downvote,
        });

        if (result.isErr()) {
          return NextResponse.json({ error: result.error.message }, { status: 500 });
        }
      }

      return NextResponse.json({ result: !isDownvoted }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to downvote post: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
