import type { Metadata } from "next";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
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
  return {
    title,
    description: `${handle}: ${content.slice(0, 150)}...`,
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

  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <Feed data={[post]} />
      <Feed data={comments} />
    </Card>
  );
};

export default post;
