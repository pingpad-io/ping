import {
  ProfileId,
  PublicationMetadataMainFocusType,
  PublicationType,
  useFeed,
  usePublications,
} from "@lens-protocol/react-web";
import ErrorPage from "./ErrorPage";
import { SuspensePostView } from "./SuspensePostView";
import { Post, lensItemToPost } from "./post/Post";
import { PostView } from "./post/PostView";


export function FeedPublic() {
  const { data, loading, error } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.TextOnly, PublicationMetadataMainFocusType.Article],
      },
    },
  });

  const posts = data.map(publication => lensItemToPost(publication))
  return (
    <Feed data={posts} loading={loading} error={error} />
  )
}

export function FeedPrivate({ profileId }: { profileId?: ProfileId }) {
  const { data, loading, error } = useFeed({
    where: {
      for: profileId,
    },
  });

  const posts = data.map(publication => lensItemToPost(publication))
  return (
    <Feed data={posts} loading={loading} error={error} />
  )
}

function Feed ({ data, loading, error }: { data: Post[]; loading: boolean; error: Error | undefined }) {
  // biome-ignore lint/suspicious/noArrayIndexKey: elements are not unique
  const suspense = [...Array(12)].map((_v, idx) => <SuspensePostView key={`suspense-${idx}`} />);

  if (loading) return suspense;

  if (error) return <ErrorPage title="Couldn't fetch posts" />;

  const feed = data.map((post, idx) => {
    return <PostView key={`${post.id}-${idx}`} post={post} />;
  });

  return feed;
}
