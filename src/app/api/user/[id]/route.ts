import { type NextRequest, NextResponse } from "next/server";
import { lensProfileToUser } from "~/components/user/User";
import { getServerAuth } from "~/utils/getLensClient";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

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
