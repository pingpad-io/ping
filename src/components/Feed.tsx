import {
  ProfileId,
  PublicationMetadataMainFocusType,
  PublicationType,
  useFeed,
  usePublications,
} from "@lens-protocol/react-web";
import ErrorPage from "./ErrorPage";
import { Post, lensItemToPost } from "./post/Post";
import { PostView } from "./post/PostView";
import { SuspenseView } from "./post/SuspenseView";


export function PublicFeed() {
  const { data, loading, error } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.TextOnly, PublicationMetadataMainFocusType.Article],
      },
    },
  });

  // biome-ignore lint/suspicious/noArrayIndexKey: elements are not unique
  const suspense = [...Array(12)].map((_v, idx) => <SuspenseView key={`suspense-${idx}`} />);

  if (loading) return suspense;

  if (error) return <ErrorPage title="Couldn't fetch posts" />;

  const posts = data.map(publication => lensItemToPost(publication)).filter(post => post)
  return (
    <Feed data={posts} />
  )
}

export function PersonalFeed({ profileId }: { profileId?: ProfileId }) {
  const { data, loading, error } = useFeed({
    where: {
      for: profileId,
    },
  });

  // biome-ignore lint/suspicious/noArrayIndexKey: elements are not unique
  const suspense = [...Array(12)].map((_v, idx) => <SuspenseView key={`suspense-${idx}`} />);

  if (loading) return suspense;

  if (error) return <ErrorPage title="Couldn't fetch posts" />;

  const posts = data.map(publication => lensItemToPost(publication)).filter(post => post)
  console.log(posts)
  return (
    <Feed data={posts} />
  )
}

function Feed({ data }: { data: Post[] }) {
  const feed = data.map((post, idx) => {
    return <PostView key={`${post.id}-${idx}`} post={post} />;
  });

  return feed;
}
