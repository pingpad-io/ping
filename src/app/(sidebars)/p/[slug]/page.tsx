import type { Metadata } from "next";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

/**
 * This route resolves to universal id of the post passed in the [slug]
 *
 * @param slug - id of the post (0x04359b-0x6c)
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { client } = await getLensClient();

  const id = params.slug;
  const post = await client.publication
    .fetch({
      forId: id,
    })
    .then((data) => lensItemToPost(data))
    .catch(() => {
      throw new Error("(╥_╥) Post not found");
    });
  const handle = post.author.handle;
  const content = "content" in post.metadata ? post.metadata.content : "";
  const title = `${handle}'s post`;
  const ending = content.length > 300 ? "..." : "";

  return {
    title,
    description: `${content.slice(0, 300)}${ending}`,
  };
}

const post = async ({ params }: { params: { slug: string } }) => {
  const { client } = await getLensClient();

  const id = params.slug;
  const lensPost = await client.publication
    .fetch({
      forId: id,
    })
    .catch(() => {
      throw new Error("(╥_╥) Post not found");
    });

  if (!lensPost) throw new Error("(╥_╥) Post not found");

  const lensComments = await client.publication.fetchAll({ where: { commentOn: { id } } });

  const post = lensItemToPost(lensPost);
  const comments = lensComments.items.map((comment) => lensItemToPost(comment));
  post.comments = comments;

  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <PostView item={post} />
    </Card>
  );
};

export default post;
