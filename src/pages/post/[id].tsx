import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery(id)

  if (!data) return <ErrorPage title={"Post not found qwq"} />;

  const post = data.post;
  const author = data.author;

  return (
    <>
      <Head>
        <title>
          @{author?.username}: {post.content}
        </title>
      </Head>

      <PageLayout>
        <div className="p-10">
          <PostView data={data} />
        </div>

        <div className="flex items-center justify-center">
          <div className="btn-ghost btn-wide btn m-4">
            <Link href={"/"}>{`< Home`}</Link>
          </div>
        </div>
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
      id: id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
