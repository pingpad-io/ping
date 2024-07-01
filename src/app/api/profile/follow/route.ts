import {
  type CredentialsExpiredError,
  type LensProfileManagerRelayErrorFragment,
  LensTransactionStatusType,
  type NotAuthenticatedError,
  type RelaySuccessFragment,
  type Result,
} from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || undefined;

  try {
    const { client } = await getLensClient();

    const profile = await client.profile.fetch({ forProfileId: id });

    const isFollowing = profile.operations.isFollowedByMe;

    let result: Result<
      RelaySuccessFragment | LensProfileManagerRelayErrorFragment,
      CredentialsExpiredError | NotAuthenticatedError
    >;
    if (isFollowing.value) {
      result = await client.profile.unfollow({
        unfollow: [id],
      });
    } else {
      result = await client.profile.follow({
        follow: [{ profileId: id }],
      });
    }

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    if (result.value.__typename === "LensProfileManagerRelayError") {
      return NextResponse.json({ error: result.value.reason }, { status: 500 });
    }

    const data = result.value;

    const completion = await client.transaction.waitUntilComplete({ forTxId: data.txId });
    if (completion?.status === LensTransactionStatusType.Failed) {
      console.error(completion.reason);
      return NextResponse.json({ error: completion.reason, extra: completion.extraInfo }, { status: 500 });
    }

    return NextResponse.json({ result: result.value }, { status: 200 });
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
