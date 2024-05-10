import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const top = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  const data = isAuthenticated
    ? await client.feed.highlights({
        where: { for: profileId },
      })
    : await client.publication.fetchAll({
        where: { publicationTypes: [PublicationType.Post] },
      });

  if (!data) return <ErrorPage title={`Couldn't fetch posts`} />;

  const items = isAuthenticated ? "unwrap" in data && data.unwrap().items : "items" in data && data.items;
  const posts = items?.map((publication) => lensItemToPost(publication)).filter((post) => post);

  return (
    <FeedPageLayout>
      <Feed data={posts} />
    </FeedPageLayout>
  );
};

export default top;
