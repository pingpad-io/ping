import type {
  CredentialsExpiredError,
  NotAuthenticatedError,
  ProfileInterestTypes,
  Result,
} from "@lens-protocol/client";
import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const interest = searchParams.get("interest") || undefined;

  if (!interest) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const { client, user } = await getServerAuth();
    const userInterestValues = user.interests.map((interest) => interest.value);

    let response: Result<void, CredentialsExpiredError | NotAuthenticatedError>;
    if (userInterestValues.includes(interest as ProfileInterestTypes)) {
      response = await client.profile.removeInterests({
        interests: [interest as ProfileInterestTypes],
      });
    } else {
      response = await client.profile.addInterests({
        interests: [interest as ProfileInterestTypes],
      });
    }

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    return NextResponse.json({ error: `Failed to fetch post: ${error.message}` }, { status: 500 });
  }
}
