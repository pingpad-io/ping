import { ChevronLeft } from "lucide-react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import PostWizard from "~/components/PostWizard";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isError, error } = api.posts.get.useQuery({ postId: id });
  const replies = api.posts.get.useQuery({ repliedToPostId: id });
  const router = useRouter();

  if (isError) return <ErrorPage title={error.data?.code ?? "Something went wrong..."} />;

  if (!data) return <Card>Loading...</Card>;
  const post = data[0];
  if (!post) return <ErrorPage title={"Post not found qwq"} />;

  const author = post.author;
  const hasReplies = replies.data ? replies.data.length > 0 : false;

  return (
    <>
      <Head>
        <title>
          @{author?.username}: {post.content} / Ping
        </title>
      </Head>

      <PageLayout>
        <div className="m-2">
          <PostView post={post} />
        </div>
        <div className="flex flex-col items-center justify-center px-2 gap-2">
          {hasReplies && (
            <div className="place-start flex grow flex-col w-full">
              <Feed {...replies} />
            </div>
          )}

          <div className="flex flex-row gap-2 items-center justify-center w-full px-2">
            <Button variant="outline" size="icon" type="button" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="w-full">
              <PostWizard replyingTo={id} />
            </div>
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

  await ssg.posts.get.prefetch({ postId: id });
  await ssg.posts.get.prefetch({ repliedToPostId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: id,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default PostPage;
