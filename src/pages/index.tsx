import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GetStaticProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";

const HomePage = () => {
  const posts = api.posts.get.useQuery({});

  return (
    <PageLayout>
      <div className="w-full flex-col hidden sm:flex flex-none">
        <PostWizard />
      </div>

      <div className="p-2 h-[92vh]">
        <Feed {...posts} />
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getSSGHelper();

  await ssg.posts.get.prefetch({});
  await ssg.threads.get.prefetch({});

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

export default HomePage;
