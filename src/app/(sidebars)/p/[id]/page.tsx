import type { Metadata } from "next";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { Card } from "~/components/ui/card";
import { getLensClient } from "~/utils/getLensClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { client } = await getLensClient();
  const post = await client.publication
    .fetch({
      forId: params.id,
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

const post = async ({ params }: { params: { id: string } }) => {
  const { client } = await getLensClient();

  const lensPost = await client.publication
    .fetch({
      forId: params.id,
    })
    .catch(() => {
      throw new Error("(╥_╥) Post not found");
    });

  if (!lensPost) throw new Error("(╥_╥) Post not found");

  const lensComments = await client.publication.fetchAll({ where: { commentOn: { id: params.id } } });

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
