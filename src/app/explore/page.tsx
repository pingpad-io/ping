import { ExplorePublicationType, ExplorePublicationsOrderByType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const explore = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();
  if (!isAuthenticated) return <ErrorPage title="Login to view this page." />;

  const data = await getInitialFeed(client, isAuthenticated, profileId);
  if (!data) return <ErrorPage title={`Couldn't fetch posts`} />;

  const posts = data.items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
  return (
    <FeedPageLayout>
      <Feed data={posts} />
    </FeedPageLayout>
  );
};
const getInitialFeed = async (client, isAuthenticated, profileId) => {
  if (isAuthenticated) {
    const response = await client.explore.publications({
      where: { publicationTypes: [ExplorePublicationType.Post] },
      orderBy: ExplorePublicationsOrderByType.Latest,
    });
    return response;
  }
};

export default explore;
