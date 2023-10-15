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
      <div className="z-[30] sticky top-0 w-full flex-col hidden sm:flex flex-none">
        <PostWizard />
      </div>

      <div className="flex flex-col gap-1 items-center justify-center p-2 w-full">
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
