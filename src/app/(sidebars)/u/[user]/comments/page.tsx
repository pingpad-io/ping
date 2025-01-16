import { LimitType, PublicationType } from "@lens-protocol/client";
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
    description: `@${handle}'s comments on Pingpad`,
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const { user, posts, nextCursor } = await getInitialData(handle);

  return (
    <Feed
      ItemView={PostView}
      endpoint={`/api/posts?id=${user.id}&type=comment`}
      initialData={posts}
      initialCursor={nextCursor}
    />
  );
};

const getInitialData = async (handle: string) => {
  const { client } = await getServerAuth();
  const user = await getUserByUsername(handle);

  const lensPosts = await client.publication
    .fetchAll({
      where: { from: [user.id], publicationTypes: [PublicationType.Comment] },
      limit: LimitType.Ten,
    })
    .catch(() => {
      throw new Error(`☆⌒(>。<) Couldn't get user posts`);
    });

  const posts = lensPosts.items.map(lensItemToPost);

  return { user, posts, nextCursor: lensPosts.pageInfo.next };
};

export default user;
