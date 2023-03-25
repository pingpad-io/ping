import { api } from "~/utils/api";

export default function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div className="loading btn">loading...</div>;
  if (!data)
    return (
      <div className="btn-error btn">
        something went wrong... terribly wrong...
      </div>
    );

  return (
    <div>
      {data?.map((post) => (
        <div className="" key={post.id}>
          {post.content}
        </div>
      ))}
    </div>
  );
}
