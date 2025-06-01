import { PostType } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
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
    openGraph: {
      title,
      description: `@${handle} on Pingpad`,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const { user, posts, nextCursor } = await getInitialData(handle);

  return (
    <Feed
      ItemView={PostView}
      endpoint={`/api/posts?address=${user.address}&type=all`}
      initialData={posts}
      initialCursor={nextCursor}
    />
  );
};

const getInitialData = async (handle: string) => {
  const { client } = await getServerAuth();
  const user = await getUserByUsername(handle);

  const lensPosts = await fetchPosts(client, {
    filter: {
      authors: [user.address],
      postTypes: [PostType.Root, PostType.Comment, PostType.Repost],
      feeds: [{ globalFeed: true }],
    },
  }).unwrapOr(null);

  if (!lensPosts || !lensPosts.items || lensPosts.items.length === 0) {
    return {
      user,
      posts: [],
      nextCursor: undefined,
    };
  }

  const posts = lensPosts.items.map(lensItemToPost);

  return { user, posts, nextCursor: lensPosts.pageInfo.next };
};

export default user;
