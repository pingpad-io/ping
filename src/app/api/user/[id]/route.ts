import { fetchAccount } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { lensAcountToUser } from "~/components/user/User";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

    const account = await fetchAccount(client, {address: id}).unwrapOr(null);

    if (!account) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const user = lensAcountToUser(account);

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user, lensProfile: account }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
