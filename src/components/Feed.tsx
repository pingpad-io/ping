import { lensFeedItemToPost, Post } from "~/types/post";
import ErrorPage from "./ErrorPage";
import { PostView } from "./PostView";
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

  const feed = data.map((feedItem, idx) => {
    const post: Post = lensFeedItemToPost(feedItem);

    if (post) {
      return <PostView key={`${post.id}-${idx}`} post={post} />;
    }
  });

  return <div className="flex flex-col gap-1">{feed}</div>;
}
