import { NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET({ params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const { client, profileId: authedProfileId } = await getServerAuth();

    const followers = await client.profile.following({
      for: id,
    });

    if (!followers) {
      return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
    }

    const isFollowingMe = followers.items.some((follower) => follower.id === authedProfileId);

    return NextResponse.json({ result: isFollowingMe }, { status: 200 });
  } catch (error) {
    console.error("Failed to follow profile: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
