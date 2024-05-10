import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { Navigation } from "~/components/menu/Navigation";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const home = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  const data = isAuthenticated
    ? await client.feed.fetch({
        where: { for: profileId },
      })
    : await client.publication.fetchAll({
        where: { publicationTypes: [PublicationType.Post] },
      });

  if (!data) return <ErrorPage title={`Couldn't fetch posts`} />;

  const items = isAuthenticated ? "unwrap" in data && data.unwrap().items : "items" in data && data.items;
  const posts = items?.map((publication) => lensItemToPost(publication)).filter((post) => post);

  return (
    <Card className="z-[30] hover:bg-card p-4 pt-0 border-0">
      <Navigation />
      <Feed data={posts} />
    </Card>
  );
};

export default home;
