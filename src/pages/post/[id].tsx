import Head from "next/head";
import { PageLayout } from "~/components/Layout";

const PostPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>

      <PageLayout>Post View</PageLayout>
    </>
  );
};

export default PostPage;
