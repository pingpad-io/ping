import type { Metadata } from "next";
import { PostThread } from "~/components/post/PostThread";
import { getServerAuth } from "~/utils/getServerAuth";

/**
 * This route resolves to universal id of the post passed in the [slug]
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = "Post";
  const description = "View post on Pingpad";

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
    },
  };
}

const post = async ({ params }: { params: { slug: string } }) => {
  const auth = await getServerAuth();

  return <PostThread post={null} />;
};

export default post;
