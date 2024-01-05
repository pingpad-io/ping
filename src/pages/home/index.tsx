import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GetStaticProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { Card } from "~/components/ui/card";

const HomePage = () => {
  const posts = api.posts.get.useQuery({});

  return (
    <PageLayout>
      <Card className="z-[30] sticky top-0 flex-col hidden sm:flex flex-none p-4 border-0">
        <PostWizard />
      </Card>

      <Feed {...posts} />
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
