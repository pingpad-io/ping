import {
  type CredentialsExpiredError,
  type NotAuthenticatedError,
  PublicationReactionType,
  type Result,
} from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Cannot repost a share publication", result: false }, { status: 400 });
    }

    const result = await client.publication.mirrorOnchain({
      mirrorOn: id,
    });

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message, result: false }, { status: 500 });
    }

    if (result.value.__typename === "LensProfileManagerRelayError") {
      return NextResponse.json({ error: result.value.reason, result: false }, { status: 500 });
    }

    if (result.value.__typename === "RelaySuccess") {
      return NextResponse.json({ result: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
