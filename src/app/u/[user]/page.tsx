"use client";
import { useProfile } from "@lens-protocol/react-web";
import { CalendarIcon, EditIcon } from "lucide-react";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import { UserAvatar } from "~/components/UserAvatar";
import { lensProfileToUser } from "~/components/post/Post";
import { TimeSince } from "~/components_old/TimeLabel";

const user = ({ params }: { params: { user: string } }) => {
  const handle = params.user;
  const {
    data: profile,
    loading,
    error,
  } = useProfile({
    forHandle: handle,
  });
  if (!profile) return <ErrorPage title="∑(O_O;) Not Found" />;

  const isUserProfile = false;
  const title = `@${profile.handle.localName ?? ""} - Pingpad`;

  return (
    <>
      <div className="sticky top-0 p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
        <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
          <UserAvatar user={lensProfileToUser(profile)} />
        </div>

        <div className="flex flex-col grow place-content-around">
          <div className="flex flex-row gap-2 place-items-center h-6">
            <div className="text-lg font-bold w-fit truncate">{profile.metadata.displayName}</div>
            {isUserProfile && (
              <Link className="btn btn-square btn-sm btn-ghost" href="/settings">
                <EditIcon size={14} />
              </Link>
            )}
          </div>
          <Link className="grow" href={`/${profile.handle.localName}`}>
            <div className="text-sm text-base-content font-light">@{profile.handle.localName}</div>
          </Link>
          <div className="text-sm text-base-content grow">{profile.metadata.bio}</div>
          <div className="text-sm text-base-content flex flex-row gap-1 place-items-center">
            <CalendarIcon size={14} />
            Joined <TimeSince date={new Date(profile.createdAt)} />
          </div>
        </div>
      </div>

      {/* <Feed {...posts} /> */}
    </>
  );
};

export default user;
