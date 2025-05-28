import { PostType } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";
import { getUserByUsername } from "~/utils/getUserByHandle";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;
  const title = `${handle}`;
  return {
    title,
    description: `@${handle} on Pingpad`,
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const { user, posts, nextCursor } = await getInitialData(handle);

  if (!user) return notFound();

  return (
    <Feed
      ItemView={PostView}
      endpoint={`/api/posts?id=${user.id}&type=post`}
      initialData={posts}
      initialCursor={nextCursor}
    />
  );
};

const getInitialData = async (username: string) => {
  const { client } = await getServerAuth();
  const user = await getUserByUsername(username);

  if (!user) {
    return { user: null, posts: null, nextCursor: null };
  }

  const result = await fetchPosts(client, {
    filter: {
      authors: [user.id],
      postTypes: [PostType.Root],
    },
  });

  if (result.isErr()) {
    throw new Error(`☆⌒(>。<) Couldn't get user posts`);
  }

  const { items, pageInfo } = result.value;
  const posts = items.map(lensItemToPost);

  return { user, posts, nextCursor: pageInfo.next };
};

export default user;
