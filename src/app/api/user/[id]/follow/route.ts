import { fetchAccount, follow, unfollow } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { client, sessionClient } = await getServerAuth();

    if (!sessionClient) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accountFetch = await fetchAccount(client, { address: id });
    if (accountFetch.isErr()) {
      return NextResponse.json(
        { error: "Failed to fetch profile", extra: accountFetch.error.message },
        { status: 500 },
      );
    }
    const isFollowing = accountFetch.value.operations.isFollowedByMe;

    if (isFollowing) {
      const result = await unfollow(sessionClient, {
        account: id,
      });

      if (result.isErr()) {
        return NextResponse.json({ error: "Failed to unfollow profile", extra: result.error.message }, { status: 500 });
      }

      return NextResponse.json({ result: result.value }, { status: 200 });
    }

    const result = await follow(sessionClient, {
      account: id,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to follow profile", extra: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ result: result.value }, { status: 200 });
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
