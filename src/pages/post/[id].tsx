import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useSelector } from "react-redux";
import ErrorPage from "~/components/ErrorPage";
import { PageLayout } from "~/components/Layout";
import { LikeButton, PostContent, PostInfo } from "~/components/PostView";
import PostWizard from "~/components/PostWizard";
import { ThreadLink } from "~/components/ThreadLink";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { type State } from "~/utils/store";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isError, error } = api.posts.getById.useQuery(id, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const currentThreadName = useSelector((state: State) => state.currentThreadName);

  if (isError) return <ErrorPage title={error.data?.code ?? "Something went wrong..."} />;
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
        <div className=" flex w-full flex-col items-center justify-center p-4">
          <div className="rounded-box flex h-fit flex-row gap-4 border border-b-0 border-base-200 border-primary p-4">
            <UserAvatar profile={author} />
            <div className="flex max-w-lg grow flex-col">
              <PostInfo data={data} />
              <PostContent post={post} collapsed={false} />
            </div>
            <LikeButton post={post} />
          </div>

          <div className="flex w-11/12 w-full flex-row">
            <PostWizard placeholder="reply..." />
          </div>
          <ThreadLink threadName={currentThreadName}>
            <div className="  btn-primary btn-ghost btn border">{`< Back`}</div>
          </ThreadLink>
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
