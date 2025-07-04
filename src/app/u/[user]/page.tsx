import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Feed } from "~/components/Feed";
import { PostView } from "~/components/post/PostView";
import type { User } from "~/components/user/User";
import { getUserByEns } from "~/utils/efp/getUserByEns";
import { isEnsHandle } from "~/utils/efp/mappers";
import { getUserByUsername } from "~/utils/getUserByHandle";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;

  let user: User | null = null;
  if (isEnsHandle(handle)) {
    const result = await getUserByEns(handle);
    user = result.user;
  } else {
    user = await getUserByUsername(handle);
  }

  if (!user) {
    return {
      title: handle,
      description: `@${handle} on Pingpad`,
    };
  }

  const displayName = user.name || handle;
  const title = `${displayName} (@${handle})`;
  const description = user.description || `@${handle} on Pingpad`;

  const ogImageURL = `${process.env.NEXT_PUBLIC_SITE_URL}/og/user?handle=${handle}&name=${encodeURIComponent(
    displayName,
  )}&profilePictureUrl=${user.profilePictureUrl}`;

  return {
    title,
    description,
    openGraph: {
      images: [ogImageURL],
      title,
      description,
      type: "profile",
      url: `https://pingpad.io/u/${handle}`,
      siteName: "Pingpad",
      locale: "en_US",
    },
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const handle = params.user;

  let user: User | null = null;
  if (isEnsHandle(handle)) {
    const result = await getUserByEns(handle);
    user = result.user;
  } else {
    user = await getUserByUsername(handle);
  }

  if (!user) return notFound();

  return <Feed ItemView={PostView} endpoint={`/api/posts?address=${user.address}&type=main`} />;
};

export default user;
