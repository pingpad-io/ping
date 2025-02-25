import { type NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const interest = searchParams.get("interest") || undefined;

  if (!interest) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const { sessionClient, user } = await getServerAuth();
    
    if (!sessionClient) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const userInterestValues = user.interests.map((interest) => interest.value);
    
    // Note: These methods are marked as "Coming soon" in the migration guide
    // For now, we'll return a message indicating this functionality is not yet available
    
    return NextResponse.json({ 
      message: "Interest management is not yet available in the new Lens Protocol API",
      currentInterests: userInterestValues,
      requestedInterest: interest
    }, { status: 200 });
    
    /* 
    // This is the code that would be used once the API is available:
    let response;
    if (userInterestValues.includes(interest)) {
      response = await removeInterests(sessionClient, {
        interests: [interest],
      });
    } else {
      response = await addInterests(sessionClient, {
        interests: [interest],
      });
    }
    
    if (response.isErr()) {
      return NextResponse.json({ error: "Failed to update interests" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
    */
  } catch (error) {
    console.error("Failed to update interests: ", error);
    return NextResponse.json({ error: `Failed to update interests: ${error.message}` }, { status: 500 });
  }
}
