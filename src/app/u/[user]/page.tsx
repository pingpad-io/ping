import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Feed } from "~/components/Feed";
import { PostView } from "~/components/post/PostView";
import { getUserByUsername } from "~/utils/getUserByHandle";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;
  const user = await getUserByUsername(handle);

  if (!user) {
    return {
      title: handle,
      description: `@${handle} on Pingpad`,
    };
  }

  const displayName = user.name || handle;
  const title = `${displayName} (@${handle})`;
  const description = user.description || `@${handle} on Pingpad`;

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      images: user.profilePictureUrl
        ? [
            {
              url: user.profilePictureUrl,
              width: 256,
              height: 256,
            },
          ]
        : [],
    },
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const user = await getUserByUsername(handle);

  if (!user) return notFound();

  return (
    <Feed
      ItemView={PostView}
      endpoint={`/api/posts?address=${user.address}&type=post`}
    />
  );
};

export default user;
