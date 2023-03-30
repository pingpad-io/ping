import { api } from "~/utils/api";
import { PostView } from "./PostView";
import PostWizard from "./PostWizard";

export default function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  let suspense = (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="loading btn"> loading...</div>
    </div>
  );

  let feed = data ? (
    data.map((post) => <PostView key={post.id} post={post} />)
  ) : (
    <div className="btn-error btn">
      something went wrong... terribly wrong...
    </div>
  );

  let content = isLoading ? suspense : feed;

  return (
    <div className="min-h-full lg:max-w-2xl max-w-full shrink-0 grow border-x border-base-300 sm:shrink">
      <PostWizard />
      {content}
    </div>
  );
}
