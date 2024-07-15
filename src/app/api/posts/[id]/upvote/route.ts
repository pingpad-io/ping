import {
  type CredentialsExpiredError,
  type NotAuthenticatedError,
  PublicationReactionType,
  type Result,
} from "@lens-protocol/client";
import { NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

    const publication = await client.publication.fetch({
      forId: id,
    });

    if (publication.__typename === "Mirror") {
      return NextResponse.json({ error: "Cannot like a share publication" }, { status: 400 });
    }

    const isUpvoted = publication.operations.hasUpvoted;
    const isDownvoted = publication.operations.hasDownvoted;

    let result: Result<void, CredentialsExpiredError | NotAuthenticatedError>;
    if (isUpvoted) {
      result = await client.publication.reactions.remove({
        for: id,
        reaction: PublicationReactionType.Upvote,
      });
    } else {
      if (isDownvoted) {
        await client.publication.reactions.remove({
          for: id,
          reaction: PublicationReactionType.Downvote,
        });
      }
      result = await client.publication.reactions.add({
        for: id,
        reaction: PublicationReactionType.Upvote,
      });
    }

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ result: !isUpvoted }, { status: 200 });
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
