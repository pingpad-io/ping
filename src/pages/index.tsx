import { useSelector } from "react-redux";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard, { ThreadDivider } from "~/components/PostWizard";
import { api } from "~/utils/api";
import type { State } from "../utils/store";

const HomePage = () => {
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

export default HomePage;
