import type { Metadata } from "next";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { client, isAuthenticated, profileId } = await getLensClient();
  const data = await client.publication.fetch({
    forId: params.id,
  });
  const handle = `@${data.by.handle.localName}`;

  const title = `${handle}'s post | Pingpad`;
  return {
    title,
    description: `@${handle} on Pingpad`,
  };
}

const post = async ({ params }: { params: { id: string } }) => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  const data = await client.publication.fetch({
    forId: params.id,
  });

  if (!data) return <ErrorPage title={`Couldn't fetch post`} />;

  const post = lensItemToPost(data);
  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <Feed data={[post]} />
    </Card>
  );
};

export default post;
