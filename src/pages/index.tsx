import { useSelector } from "react-redux";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard, { ThreadDivider } from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GLOBAL_THREAD_ID, type State } from "../utils/store";
import { type GetServerSideProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { type PropsWithChildren } from "react";

const HomePage = (props: PropsWithChildren) => {
  const currentThreadId = useSelector((state: State) => state.currentThreadId);
  const posts = api.posts.getAllByThreadId.useQuery(currentThreadId);

  return (
    <PageLayout>
      <div className="sticky top-0 z-10 flex w-full flex-col">
        <PostWizard placeholder="write a new twot..." />
        <ThreadDivider />
      </div>
      <div className="px-2">
        <Feed {...posts} />
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = getSSGHelper();

  await ssg.posts.getAllByThreadId.prefetch(GLOBAL_THREAD_ID);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default HomePage;
