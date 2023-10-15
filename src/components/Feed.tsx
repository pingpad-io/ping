/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ErrorPage from "./ErrorPage";
import { PostView } from "./Post";
import { SuspensePostView } from "./SuspensePostView";
import { Post } from "~/server/api/routers/posts";

export default function Feed(props: {
  data?: Post[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (props.isLoading) {
    const suspense = [...Array(12)].map((e, i) => (
      <SuspensePostView key={`${i}`} />
    ));
    return <div className="flex flex-col gap-1">{suspense}</div>;
  }

  if (props.isError || !props.data)
    return <ErrorPage title="Couldn't fetch posts" />;

  const feed = props.data.map((post) => <PostView key={post.id} post={post} />);

  return (
    <div
      id="scrollable"
      className="flex flex-col gap-1 overflow-y-scroll scroll-smooth snap-mandatory h-[91vh] snap-y "
    >
      {feed}
    </div>
  );
}
