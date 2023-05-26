import { useSelector } from "react-redux";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { State } from "./store";

const HomePage = () => {
  const currentThreadId = useSelector((state: State) => state.currentThread);
  const posts = api.posts.getAllByThreadId.useQuery(currentThreadId);

  return (
    <PageLayout>
      <PostWizard />
      <Feed {...posts} />
    </PageLayout>
  );
};

export default HomePage;
