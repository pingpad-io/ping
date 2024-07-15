import {
  LensTransactionStatusType,
  type MultirecipientFeeCollectOpenActionSettingsFragment,
  type SimpleCollectOpenActionSettingsFragment,
} from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";
type CollectActionModuleSettings =
  | SimpleCollectOpenActionSettingsFragment
  | MultirecipientFeeCollectOpenActionSettingsFragment;

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
      return NextResponse.json({ error: "Cannot collect a share publication", result: false }, { status: 400 });
    }

    const result = await client.publication.actions.actOn({
      actOn: {
        simpleCollectOpenAction: true,
      },
      for: id,
    });

    if (result.isFailure()) {
      return NextResponse.json({ error: result.error.message, result: false }, { status: 500 });
    }

    if (result.value.__typename === "LensProfileManagerRelayError") {
      return NextResponse.json({ error: result.value.reason, result: false }, { status: 500 });
    }

    const data = result.value;

    const completion = await client.transaction.waitUntilComplete({ forTxId: data.txId });

    if (completion.status === LensTransactionStatusType.Failed) {
      return NextResponse.json({ error: completion.reason, result: false }, { status: 500 });
    }

    if (completion.status === LensTransactionStatusType.Complete) {
      return NextResponse.json({ result: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}`, result: false }, { status: 500 });
  }
}
