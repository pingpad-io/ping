import { LimitType, PublicationType } from "@lens-protocol/client";
import type { Metadata } from "next";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { lensProfileToUser } from "~/components/user/User";
import { UserNavigation } from "~/components/user/UserNavigation";
import { UserProfile } from "~/components/user/UserProfile";
import { getLensClient } from "~/utils/getLensClient";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;
  const title = `${handle}`;
  return {
    title,
    description: `@${handle} on Pingpad`,
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const { handle: authenticatedHandle } = await getLensClient();
  const handle = params.user;
  const isUserProfile = handle === authenticatedHandle;
  const { user, posts, nextCursor } = await getInitialData(handle);

  if (!user) throw new Error("∑(O_O;) Profile not found");

  return (
    <>
      <UserProfile user={user} isUserProfile={isUserProfile} />
      <UserNavigation handle={handle} />

      <Card className="z-[30] hover:bg-card p-4 border-0">
        <InfiniteScroll endpoint={`/api/posts?id=${user.id}`} initialData={posts} initialCursor={nextCursor} />
      </Card>
    </>
  );
};

const getInitialData = async (handle: string) => {
  const { client } = await getLensClient();

  const profile = await client.profile.fetch({
    forHandle: `lens/${handle}`,
  });

  const user = lensProfileToUser(profile);
  if (!user) throw new Error("∑(O_O;) Profile not found");

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
