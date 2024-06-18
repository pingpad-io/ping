import { type NextRequest, NextResponse } from "next/server";
import { lensProfileToUser } from "~/components/user/User";
import { getLensClient } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || undefined;

  try {
    const { client } = await getLensClient();

    const lensProfile = await client.profile.fetch({
      forProfileId: id,
    });

    const profile = lensProfileToUser(lensProfile);

    return NextResponse.json({ profile, lensProfile }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
