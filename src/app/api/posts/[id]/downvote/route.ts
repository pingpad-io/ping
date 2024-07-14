import {
  type CredentialsExpiredError,
  type NotAuthenticatedError,
  PublicationReactionType,
  type Result,
} from "@lens-protocol/client";
import { NextResponse } from "next/server";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function POST({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client } = await getLensClient();

    const publication = await client.publication.fetch({
      forId: id,
    });

    if (publication.__typename === "Mirror") {
      return NextResponse.json({ error: "Cannot downvote a share publication" }, { status: 400 });
    }

    const isDownvoted = publication.operations.hasDownvoted;
    const isUpvoted = publication.operations.hasUpvoted;

    let result: Result<void, CredentialsExpiredError | NotAuthenticatedError>;
    if (isDownvoted) {
      result = await client.publication.reactions.remove({
        for: id,
        reaction: PublicationReactionType.Downvote,
      });
    } else {
      if (isUpvoted) {
        await client.publication.reactions.remove({
          for: id,
          reaction: PublicationReactionType.Upvote,
        });
      }
      result = await client.publication.reactions.add({
        for: id,
        reaction: PublicationReactionType.Downvote,
      });
    }

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ result: !isDownvoted }, { status: 200 });
  } catch (error) {
    console.error("Failed to downvote publication: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
