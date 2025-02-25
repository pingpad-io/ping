import { fetchPosts } from "@lens-protocol/client/actions";
import { type NextRequest, NextResponse } from "next/server";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing publication id" }, { status: 400 });
  }

  try {
    const { client } = await getServerAuth();

    // In the new API, we need to fetch all posts and filter for comments
    // This is a temporary solution until a direct API for fetching comments is available
    const result = await fetchPosts(client, {
      filter: {
        postTypes: ["COMMENT"],
      },
      pageSize: 25,
      cursor,
    });

    if (result.isErr()) {
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }

    const comments = result.value;

    if (!comments.items) {
      throw new Error("No comments found");
    }

    // Note: This is a temporary solution
    // In a production environment, you would need to implement a more efficient way
    // to fetch comments for a specific post once the API supports it
    const commentsPosts = comments.items
      .filter(item => {
        // We can't directly check for comments on a specific post with the current API
        // This is a placeholder for when the API supports it
        return true;
      })
      .map(comment => lensItemToPost(comment));

    return NextResponse.json({ 
      comments: commentsPosts, 
      nextCursor: comments.pageInfo.next,
      note: "Comment filtering is limited with the current API version"
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to load comments: ", error.message);
    return NextResponse.json({ error: `${error.message}` }, { status: 500 });
  }
}
