import type { NextRequest } from "next/server";
import { type Community, stringToCommunity } from "~/components/communities/Community";

export const dynamic = "force-dynamic";

/// FIXME: hardcoded for now
const communities = [
  "pingpad",
  "orbcommunitiesart",
  "orbcommunitiesbuild",
  "orbcommunitieslens",
  "orbcommunitiesbooks",
  "orbcommunitiesbonsai",
  "orbcommunitiesdefi",
  "orbcommunitiesdevelopers",
  "orbcommunitiesmemes",
  "orbcommunitiesmetaverse",
  "orbcommunitiesphotography",
  "orbcommunitiesraave",
  "orbcommunitiesdesign",
  "orbcommunitiesvinylandmusic",
  "orbcommunitiesmemes",
  "orbcommunitiesbooks",
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q");

  try {
    let result: Community[] = [];
    if (!query) {
      result = communities.map(stringToCommunity);
    } else {
      result = communities.filter((community) => community.includes(query)).map(stringToCommunity);
    }

    if (result.length === 0) {
      return new Response(JSON.stringify({ communities: [], error: "No results found" }), { status: 200 });
    }

    return new Response(JSON.stringify({ communities: result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to fetch communities: ${error.message}` }), { status: 500 });
  }
}
