import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";

const HomePage = () => {
  const posts = api.posts.getAll.useQuery();

  return (
    <PageLayout>
      <PostWizard />
      <Feed {...posts} />
    </PageLayout>
  );
};

export default HomePage;
