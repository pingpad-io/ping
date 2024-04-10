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

  const suspense = [...Array(12)].map((idx) => <SuspensePostView key={`suspense-${idx}`} />);

  if (loading) return suspense;

  if (error) return <ErrorPage title="Couldn't fetch posts" />;

  const feed = data.map((feedItem, idx) => {
    const post: Post = lensFeedItemToPost(feedItem);

    if (post) {
      return <PostView key={`${post.id}-${idx}`} post={post} />;
    }
  });

  return feed;
}
