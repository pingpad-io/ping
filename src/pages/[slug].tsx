import { useUser } from "@supabase/auth-helpers-react";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { FlairView } from "~/components/FlairView";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { MenuItem } from "~/components/MenuItem";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const user = useUser();
  const { data: profile } = api.profiles.getProfileByUsername.useQuery({
    username,
  });
  if (!profile) return <ErrorPage title="∑(O_O;) Not Found" />;

  const isUserProfile = profile?.id === user?.id;
  const posts = api.posts.getAllByAuthorId.useQuery(profile.id);
  const usernameText = profile.username ?? "";
  const title = `Twotter (@${usernameText})`;

  const flair = profile.flairs.length > 0 && (
    <span className="h-min">
      <FlairView flair={profile.flairs.at(0)} size="md" />
    </span>
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageLayout>
        <div className="rounded-box m-4 flex flex-row items-center gap-4 border border-base-300 p-4">
          <UserAvatar profile={profile} />

          <Link className="grow" href={`/${usernameText}`}>
            <div className="flex flex-row gap-2">
              <div className="text-lg font-bold">{profile.full_name}</div>
              {flair}
            </div>
            <div className="text-xs text-base-content">@{profile.username}</div>
          </Link>

          <div className="flex flex-col place-content-between gap-1">
            {profile.created_at && (
              <div className="text-sm text-base-content">
                member since: <TimeSince date={profile.created_at} />
              </div>
            )}
          </div>

          {isUserProfile && (
            <CollapsedContext.Provider value={true}>
              <MenuItem href="/settings" icon={<FiEdit2 />} text="Edit Profile" />
            </CollapsedContext.Provider>
          )}
        </div>

        <div className="divider"></div>

        <div className="px-4">
          <Feed {...posts} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
  const username = context.params?.slug;

  if (typeof username !== "string") throw new Error("Bad URL slug");

  await ssg.profiles.getProfileByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
