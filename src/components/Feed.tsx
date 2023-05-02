import { RouterOutputs } from "~/utils/api";
import ErrorPage from "./ErrorBoundary";
import { PostView } from "./PostView";
import { SuspensePostView } from "./SuspensePostView";

export type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export default function Feed(props: {
  data?: PostWithUser[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (props.isLoading) {
    let suspense = [...Array(10)].map((e, i) => <SuspensePostView key={i} />);
    return <> {suspense} </>;
  }

  if (props.isError || !props.data)
    return <ErrorPage title="Couldn't fetch posts" />;

  let feed = props.data.map((post) => (
    <PostView key={post.post.id} post={post} />
  ));

  return <>{feed}</>;
}
