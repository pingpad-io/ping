import { RouterOutputs } from "~/utils/api";
import { PostView } from "./PostView";
import { Post } from "@prisma/client";
import ErrorPage from "./ErrorBoundary";
import { SuspensePostView } from "./SuspencePostView";

export type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export default function Feed(props: {
  data?: PostWithUser[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (props.isLoading)
    return [...Array(10)].map((e, i) => <SuspensePostView />);

  if (props.isError || !props.data)
    return <ErrorPage title="Couldn't fetch posts" />;

  let feed = props.data.map((post) => (
    <PostView key={post.post.id} post={post} />
  ));

  return <>{feed}</>;
}
