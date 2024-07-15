import { LimitType, PublicationType } from "@lens-protocol/client";
import { Feed } from "~/components/Feed";
import { getCommunityTags } from "~/components/communities/Community";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";

const endpoint = "/api/posts";

const community = async ({ params }: { params: { community: string } }) => {
  const { posts, nextCursor } = await getInitialFeed(params.community);

  if (!posts) {
    throw new Error("Failed to get posts");
  }

  return (
    <Feed
      ItemView={PostView}
      endpoint={`${endpoint}?community=${params.community}`}
      initialData={posts}
      initialCursor={nextCursor}
    />
  );
};

const getInitialFeed = async (community: string) => {
  const { client } = await getServerAuth();
  const tags = getCommunityTags(community);

  const data = await client.publication
    .fetchAll({
      where: { publicationTypes: [PublicationType.Post], metadata: { tags: { oneOf: tags } } },
      limit: LimitType.Ten,
    })
    .catch(() => {
      throw new Error("(×_×)⌒☆ Failed to fetch feed");
    });

  const posts = data.items.map(lensItemToPost);
  return { posts, nextCursor: data.pageInfo.next };
};

export default community;
