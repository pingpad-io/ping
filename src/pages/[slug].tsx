import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { BsGear } from "react-icons/bs";
import { FiEdit, FiEdit2, FiEdit3 } from "react-icons/fi";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { MenuItem } from "~/components/MenuItem";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const user = useUser();
  const { data: profile } = api.profile.getProfileByUsername.useQuery({
    username,
  });
  const isUserProfile = profile?.id === user?.id;

  if (!profile) {
    return <ErrorPage title="∑(O_O;) Not Found " />;
  }

  const posts = api.posts.getAllByAuthorId.useQuery(profile.id);
  const title = `Twotter (@${profile.username})`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageLayout>
        <div className="m-4 flex flex-row items-center gap-4 rounded-3xl border border-base-300 p-4">
          <UserAvatar profile={profile} />

          <Link className="grow" href={`/${profile.username}`}>
            <div className="text-lg font-bold">{profile.full_name}</div>
            <div className="text-xs text-base-content">@{profile.username}</div>
          </Link>

          {isUserProfile && (
            <CollapsedContext.Provider value={true}>
              <MenuItem
                href="/settings"
                icon={<FiEdit2 />}
                name="Edit Profile"
              />
            </CollapsedContext.Provider>
          )}
        </div>

        <div className="divider"></div>

        <Feed {...posts} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
  const username = context.params?.slug;

  if (typeof username !== "string") throw new Error("Bad URL slug");

  await ssg.profile.getProfileByUsername.prefetch({ username });

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
