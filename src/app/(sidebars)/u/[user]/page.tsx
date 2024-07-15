import { LimitType, PublicationType } from "@lens-protocol/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";
import { getUserByHandle } from "~/utils/getUserByHandle";

export const maxDuration = 60;

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

const getInitialData = async (handle: string) => {
  const { client } = await getServerAuth();
  const user = await getUserByHandle(handle);

  if (!user) {
    return { user: null, posts: null, nextCursor: null };
  }

  const lensPosts = await client.publication
    .fetchAll({
      where: { from: [user.id], publicationTypes: [PublicationType.Post] },
      limit: LimitType.Ten,
    })
    .catch(() => {
      throw new Error(`☆⌒(>。<) Couldn't get user posts`);
    });

  const posts = lensPosts.items.map(lensItemToPost);

  return { user, posts, nextCursor: lensPosts.pageInfo.next };
};

export default user;
