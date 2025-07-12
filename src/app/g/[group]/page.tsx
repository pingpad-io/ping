import { fetchGroup } from "@lens-protocol/client/actions";
import type { Metadata } from "next";
import { ServerSignedIn } from "~/components/auth/ServerSignedIn";
import { Feed } from "~/components/Feed";
import PostComposer from "~/components/post/PostComposer";
import { PostView } from "~/components/post/PostView";
import { getServerAuth } from "~/utils/getServerAuth";
import { getLensClient } from "~/utils/lens/getLensClient";

export const metadata: Metadata = {
  title: "Group",
  description: "Group feed",
  openGraph: {
    title: "Group",
    description: "Group feed",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

interface GroupPageProps {
  params: {
    group: string;
  };
}

const GroupPage = async ({ params }: GroupPageProps) => {
  const { user } = await getServerAuth();
  const client = await getLensClient();
  const groupResult = await (await fetchGroup(client, { group: params.group }))._unsafeUnwrap(null);
  const feedAddress = groupResult?.feed?.address;
  const canPost = groupResult?.feed.operations.canPost.__typename === "FeedOperationValidationPassed";

  const endpoint = feedAddress ? `/api/posts?feed=${feedAddress}` : `/api/posts?group=${params.group}`;

  return (
    <div className="z-[30] p-4 py-0">
      <ServerSignedIn>
        <div className="pt-4 pb-2">
          {canPost && (
            <div className="p-4 glass rounded-xl">
              <PostComposer user={user} feed={feedAddress} />
            </div>
          )}
        </div>
      </ServerSignedIn>
      <Feed ItemView={PostView} endpoint={endpoint} />
    </div>
  );
};

export default GroupPage;
