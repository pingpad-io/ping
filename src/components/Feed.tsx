import ErrorPage from "./ErrorPage";
import { PostView } from "../components_old/PostView";
import { SuspensePostView } from "./SuspensePostView";
import { ProfileId, useFeed } from "@lens-protocol/react-web";

export function Feed({ profileId }: { profileId: ProfileId }) {
  const { data, loading, error } = useFeed({
    where: {
      for: profileId,
    },
  });

  if (loading) {
    const suspense = [...Array(12)].map((_e, _i) => <SuspensePostView />);
    return <div className="flex flex-col gap-1">{suspense}</div>;
  }

  if (error || !data) return <ErrorPage title="Couldn't fetch posts" />;

  // const feed = data.map((post) => <PostView key={post.id} post={post} />);
  const feed = data.map((post) => post.id);

  return <div className="flex p-2 flex-col gap-1">{feed}</div>;
}
