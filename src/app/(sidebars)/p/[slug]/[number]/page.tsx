import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { Card } from "~/components/ui/card";
import { getServerAuth } from "~/utils/getLensClient";

export async function generateMetadata({ params }: { params: { slug: string; number: number } }): Promise<Metadata> {
  const post = await postFromHandleWithCount(params.slug, params.number);
  if (!post) return notFound();

  const handle = post.author.handle;
  const content = "content" in post.metadata ? post.metadata.content : "";
  const title = `${handle}'s post`;
  const ending = content.length > 300 ? "..." : "";

  return {
    title,
    description: `${content.slice(0, 300)}${ending}`,
  };
}

/**
 * This route resolves to handle + decimal post number
 *
 * @param slug - username of the creator (handle)
 * @param number - number of the post in decimal format (99)
 */

const post = async ({ params }: { params: { slug: string; number: number } }) => {
  const { client } = await getServerAuth();
  const post = await postFromHandleWithCount(params.slug, params.number);

  if (!post) return notFound();

  const comments = (await client.publication.fetchAll({ where: { commentOn: { id: post.id } } })).items.map(
    lensItemToPost,
  );

  post.comments = comments;

  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <PostView item={post} />
    </Card>
  );
};

const postFromHandleWithCount = async (handle: string, count: number) => {
  const { client } = await getServerAuth();

  const namespace = "lens";
  const postNumberDecimal = Number(count);
  const postNumberHex = postNumberDecimal.toString(16).padStart(2, "0");
  const currentHandleHolder = await client.profile.fetch({ forHandle: `${namespace}/${handle}` });
  const fullPostId = `${currentHandleHolder.id}-0x${postNumberHex}`;

  const post = await client.publication
    .fetch({
      forId: fullPostId,
    })
    .then((data) => lensItemToPost(data));

  return post;
};

export default post;
