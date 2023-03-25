import { api } from "~/utils/api";

export default function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  let suspense = (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="loading btn"> loading...</div>
    </div>
  );
  let feed = data ? (
    data.map((post) => (
      <div className="mt-10 border-2 border-slate-800 p-4" key={post.id}>
        {post.content}
      </div>
    ))
  ) : (
    <div className="btn-error btn">
      something went wrong... terribly wrong...
    </div>
  );
  let content = isLoading ? suspense : feed;

  return (
    <div className="min-h-full w-full max-w-2xl border-x-2 border-slate-900">
      <div className="flex h-12 items-center justify-center">
        <h2 className="text-2xl">Global Board</h2>
      </div>
      {content}
    </div>
  );
}
