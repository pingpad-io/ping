import type { Post } from "~/server/api/routers/posts";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ErrorPage from "./ErrorPage";
import { PostView } from "./PostView";
import { SuspensePostView } from "./SuspensePostView";

export default function Feed(props: {
  data?: Post[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (props.isLoading) {
    const suspense = [...Array(12)].map((_e, _i) => <SuspensePostView />);
    return <div className="flex flex-col gap-1">{suspense}</div>;
  }

  if (props.isError || !props.data) return <ErrorPage title="Couldn't fetch posts" />;

  const feed = props.data.map((post) => <PostView key={post.id} post={post} />);

  return <div className="flex p-2 flex-col gap-1">{feed}</div>;
}
