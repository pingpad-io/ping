import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/Layout";
import { getSSGHelper } from "~/server/extra/getSSGHelper";
import { api } from "~/utils/api";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: post } = api.posts.getById.useQuery(id);

  // TODO FIXME
  if (!post) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="card flex h-64 w-64 place-content-around items-center p-4">
          <h1 className="card-title text-error-content">Post not found?</h1>
          <div className="card-actions justify-center">
            <Link className="btn-primary btn" href={"/"}>{`< Go back`}</Link>
          </div>
        </div>
      </div>
    );
  }

  const posts = api.posts.getAllByUserId.useQuery(post.post.id);

  return (
    <>
      <Head>
        <title>Twotter (@{post.post.id})</title>
      </Head>

      <PageLayout>
        <div className="m-4 flex flex-row items-center gap-4 rounded-3xl border border-base-300 p-2">
          {post.post.content}
        </div>
        <div className="divider"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("Bad post id");

  await ssg.posts.getById.prefetch(id);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
