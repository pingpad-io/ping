import {
  type CredentialsExpiredError,
  LensTransactionStatusType,
  type NotAuthenticatedError,
  PublicationReactionType,
  type Result,
} from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Cannot bookmark a share publication" }, { status: 400 });
    }

    const bookmarkExists = publication.operations.hasBookmarked;

    let result: Result<void, CredentialsExpiredError | NotAuthenticatedError>;
    if (bookmarkExists) {
      result = await client.publication.bookmarks.remove({
        on: id,
      });
    } else {
      result = await client.publication.bookmarks.add({
        on: id,
      });
    }

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ result: !bookmarkExists }, { status: 200 });
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
