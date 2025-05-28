import { Post, PostReferenceType } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
import { lensItemToPost } from "~/components/post/Post";
import { PostView } from "~/components/post/PostView";
import { Card } from "~/components/ui/card";
import { getServerAuth } from "~/utils/getServerAuth";

/**
 * This route resolves to universal id of the post passed in the [slug]
 *
 * @param slug - id of the post (0x04359b-0x6c)
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { client } = await getServerAuth();

  const id = params.slug;
  const post = await fetchPost(client, {
    post: id,
  })
    .unwrapOr(null)
    .then((data) => lensItemToPost(data))
    .catch(() => {
      throw new Error("(╥_╥) Post not found");
    });

  const handle = post.author.handle;
  const content = "content" in post.metadata ? (post.metadata.content as string) : "";
  const title = `${handle}'s post`;
  const ending = content.length > 300 ? "..." : "";

  return {
    title,
    description: `${content.slice(0, 300)}${ending}`,
  };
}

const post = async ({ params }: { params: { slug: string } }) => {
  const { client } = await getServerAuth();

  const id = params.slug;
  const lensPost = await fetchPost(client, {
    post: id,
  })
    .unwrapOr(null)
    .then((data) => lensItemToPost(data))
    .catch(() => {
      throw new Error("(╥_╥) Post not found");
    });

  if (!lensPost) throw new Error("(╥_╥) Post not found");
  console.log(lensPost);

  const lensComments = await fetchPostReferences(client, {
    referenceTypes: [PostReferenceType.CommentOn],
    referencedPost: id,
  })
    .unwrapOr(null)
    .then((data) => data.items.map((item) => lensItemToPost(item)))
    .catch(() => {
      throw new Error("(╥_╥) Comments not found");
    });

  lensPost.comments = lensComments;

  return (
    <Card className="z-[30] hover:bg-card p-4 border-0">
      <PostView item={lensPost} />
    </Card>
  );
};

export default post;
