import { api } from "~/utils/api";
import { PostView } from "./PostView";
import PostWizard from "./PostWizard";

export default function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  let loading = (
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

  let content = isLoading ? loading : feed;

  return (
    <>
      <PostWizard />
      {content}
    </>
  );
}
