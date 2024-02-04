import type { Post } from "~/server/api/routers/posts";
import { ChatView } from "./ChatView";
import ErrorPage from "./ErrorPage";

export default function Chat(props: {
  data?: Post[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (props.isLoading) {
    // const suspense = [...Array(12)].map((_e, i) => <SuspensePostView key={`${i}`} />);
    return <div className="flex flex-col gap-1">loading...</div>;
  }

  if (props.isError || !props.data) return <ErrorPage title="Couldn't fetch posts" />;

  const feed = props.data.map((post) => <ChatView key={post.id} post={post} />);

  return <div className="flex p-2 flex-col gap-1">{feed}</div>;
}
