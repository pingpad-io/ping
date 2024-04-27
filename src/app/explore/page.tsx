import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

const explore = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();
  if (isAuthenticated) return <ErrorPage title="Login to view this page." />;

  const data = await client.feed.fetch({
    where: { for: profileId },
  });

  if (data.isFailure()) return <ErrorPage title={`Couldn't fetch posts: ${data.error} `} />;

  const items = data.unwrap().items;
  const posts = items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
  return <Feed data={posts} />;
};

export default explore;
