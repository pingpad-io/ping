import { PublicationType } from "@lens-protocol/client";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { InfiniteScrollFeed } from "~/components/InfiniteScroll";
import { FeedPageLayout } from "~/components/FeedPagesLayout";
import { lensItemToPost } from "~/components/post/Post";
import { getLensClient } from "~/utils/getLensClient";

// const home = async () => {
//   const { client, isAuthenticated, profileId } = await getLensClient();

//   const data = isAuthenticated
//     ? (
//         await client.feed.fetch({
//           where: { for: profileId },

//         })
//       ).unwrap()
//     : await client.publication.fetchAll({
//         where: { publicationTypes: [PublicationType.Post] },

//       });

//   if (!data.items) return <ErrorPage title={`Couldn't fetch posts`} />;

//   const posts = data.items?.map((publication) => lensItemToPost(publication)).filter((post) => post);

//   return (
//     <FeedPageLayout>
//       <Feed data={posts} />
//     </FeedPageLayout>
//   );
// };
const home = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  const fetchInitialData = async () => {
    if (isAuthenticated) {
      const response = await client.feed.fetch({ where: { for: profileId } });
      return response.unwrap();
    }

    return await client.publication.fetchAll({ where: { publicationTypes: [PublicationType.Post] } });
  };

  const initialData = await fetchInitialData();

  if (!initialData.items) {
    return <ErrorPage title={`Couldn't fetch posts`} />;
  }

  const posts = initialData.items.map(lensItemToPost).filter((post) => post);

  return (
    <FeedPageLayout>
      <InfiniteScrollFeed
        initialPosts={posts}
        initialCursor={initialData.pageInfo.next}
        isAuthenticated={isAuthenticated}
        profileId={profileId}
      />
    </FeedPageLayout>
  );
};

export default home;
