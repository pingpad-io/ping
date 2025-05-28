import { PostType } from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
import { GalleryFeed } from "~/components/GalleryFeed";
import { GalleryPostView } from "~/components/post/GalleryPostView";
import { lensItemToPost } from "~/components/post/Post";
import { getServerAuth } from "~/utils/getServerAuth";
import { getUserByUsername } from "~/utils/getUserByHandle";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;
  const title = `${handle}`;
  return {
    title,
    description: `@${handle}'s gallery on Pingpad`,
  };
}

const userGallery = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const { user, posts, nextCursor } = await getInitialData(handle);

  return (
    <GalleryFeed
      ItemView={GalleryPostView}
      endpoint={`/api/posts?address=${user.address}&type=post&media=true`}
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
      postTypes: [PostType.Root],
    },
  }).unwrapOr(null);

  if (!lensPosts || !lensPosts.items || lensPosts.items.length === 0) {
    return {
      user,
      posts: [],
      nextCursor: undefined,
    };
  }

  const posts = lensPosts.items
    .map(lensItemToPost)
    .filter((post) => post && ["ImageMetadata", "VideoMetadata"].includes(post.metadata?.__typename));

  return { user, posts, nextCursor: lensPosts.pageInfo.next };
};

export default userGallery;
