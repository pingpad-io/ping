import { fetchAccount } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { lensAccountToUser } from "~/components/user/User";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(_req: NextRequest, { params }: { params: { handle: string } }) {
  const handle = params.handle?.toLowerCase();
  if (!handle) {
    return NextResponse.json({ error: "Missing handle" }, { status: 400 });
  }

  const cacheKey = `user:${handle}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const { client } = await getServerAuth();

    const result = await fetchAccount(client, {
      username: { localName: handle }
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }

    const account = result.value;

    if (!account) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = lensAccountToUser(account);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const responseData = { user };
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user: ", error);
    return NextResponse.json({ error: `Failed to fetch user: ${error.message}` }, { status: 500 });
  }
}