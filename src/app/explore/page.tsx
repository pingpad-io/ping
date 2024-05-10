import { ExplorePublicationType, ExplorePublicationsOrderByType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { Navigation } from "~/components/menu/Navigation";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

const explore = async () => {
  const { client, isAuthenticated } = await getLensClient();
  if (!isAuthenticated) return <ErrorPage title="Login to view this page." />;

  const data = await client.explore.publications({
    where: { publicationTypes: [ExplorePublicationType.Post] },
    orderBy: ExplorePublicationsOrderByType.Latest,
  });

  if (!data) return <ErrorPage title={`Couldn't fetch posts`} />;

  const posts = data.items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
  return (
    <Card className="z-[30] hover:bg-card p-4 pt-0 border-0">
      <Navigation />
      <Feed data={posts} />
    </Card>
  );
};

export default explore;
