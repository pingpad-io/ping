import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const home = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  if (isAuthenticated) {
    const data = await client.feed.fetch({
      where: { for: profileId },
    });

    if (data.isFailure()) return <ErrorPage title={`Couldn't fetch posts: ${data.error} `} />;

    const items = data.unwrap().items;
    const posts = items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
    return (
      <Card className="z-[30] hover:bg-card p-4 border-0">
        <Feed data={posts} />
      </Card>
    );
  }

  const data = await client.publication.fetchAll({
    where: { publicationTypes: [PublicationType.Quote] },
  });

  if (!data) return <ErrorPage title={`Couldn't fetch posts`} />;

  const posts = data.items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <Feed data={posts} />
    </Card>
  );
};

export default home;
