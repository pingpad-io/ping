import { PublicationType } from "@lens-protocol/client";
import { CalendarIcon, EditIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Feed } from "~/components/Feed";
import { TimeSince } from "~/components/TimeLabel";
import { lensItemToPost } from "~/components/post/Post";
import { Card } from "~/components/ui/card";
import { lensProfileToUser } from "~/components/user/User";
import { UserAvatar } from "~/components/user/UserAvatar";
import { getLensClient } from "~/utils/getLensClient";

export async function generateMetadata({ params }: { params: { user: string } }): Promise<Metadata> {
  const handle = params.user;
  const title = `${handle}`;
  return {
    title,
    description: `@${handle} on Pingpad`,
  };
}

const user = async ({ params }: { params: { user: string } }) => {
  const { client, handle: authenticatedHandle } = await getLensClient();

  const handle = params.user;
  const isUserProfile = handle === authenticatedHandle;
  const user = await client.profile
    .fetch({
      forHandle: `lens/${handle}`,
    })
    .then((data) => {
      return lensProfileToUser(data);
    });

  if (!user) throw new Error("∑(O_O;) Profile not found");

  const posts = await client.publication
    .fetchAll({
      where: { from: [user.id], publicationTypes: [PublicationType.Post] },
    })
    .then((data) => {
      return data.items.map(lensItemToPost);
    })
    .catch(() => {
      throw new Error(`☆⌒(>。<) Couldn't get user posts`);
    });

  return (
    <>
      <div className="sticky top-0 p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
        <div className="flex w-12 h-12 sm:w-24 sm:h-24">
          <UserAvatar card={false} user={user} />
        </div>

        <div className="flex flex-col grow place-content-around">
          <div className="flex flex-row gap-2 place-items-center h-6">
            <div className="text-lg font-bold w-fit truncate">{user.name}</div>
            <div className="text-sm text-base-content font-light">@{user.handle}</div>
            {isUserProfile && (
              <Link className="btn btn-square btn-sm btn-ghost" href="/settings">
                <EditIcon size={14} />
              </Link>
            )}
          </div>
          <div className="text-sm text-base-content grow">{user.description}</div>
          <div className="text-sm text-base-content flex flex-row gap-1 place-items-center">
            <CalendarIcon size={14} />
            Joined <TimeSince date={new Date(user.createdAt)} />
          </div>
        </div>
      </div>

      <Card className="z-[30] hover:bg-card p-4 border-0">
        <Feed data={posts} />
      </Card>
    </>
  );
};

export default user;
