import { useUser } from "@supabase/auth-helpers-react";
import { CalendarIcon, EditIcon } from "lucide-react";
import {
  GetStaticProps,
  type GetServerSideProps,
  type NextPage,
  GetStaticPaths,
} from "next";
import Head from "next/head";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const user = useUser();
  const { data: profile } = api.profiles.get.useQuery({ username });
  const posts = api.posts.get.useQuery({ authorUsername: username });

  if (!profile) return <ErrorPage title="∑(O_O;) Not Found" />;

  const isUserProfile = profile?.id === user?.id;
  const title = `@${profile.username ?? ""} @ping`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageLayout>
        <div className="sticky top-0 p-4 z-20 flex w-full flex-row gap-4 border-b border-base-300 bg-base-200/30 bg-card rounded-b-lg drop-shadow-md">
          <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24">
            <UserAvatar userId={profile.id} />
          </div>

          <div className="flex flex-col grow place-content-around">
            <div className="flex flex-row gap-2 place-items-center h-6">
              <div className="text-lg font-bold w-fit truncate">
                {profile.full_name}
              </div>
              {isUserProfile && (
                <Link
                  className="btn btn-square btn-sm btn-ghost "
                  href="/settings"
                >
                  <EditIcon size={14} />
                </Link>
              )}
            </div>
            <Link className="grow" href={`/${profile.username ?? ""}`}>
              <div className="text-sm text-base-content font-light">
                @{profile.username}
              </div>
            </Link>
            <div className="text-sm text-base-content grow">
              {profile.description}
            </div>
            {profile.created_at && (
              <div className="text-sm text-base-content flex flex-row gap-1 place-items-center">
                <CalendarIcon size={14} />
                Joined <TimeSince date={profile.created_at} />
              </div>
            )}
          </div>
        </div>

        <div className="p-2 h-[86vh]">
          <Feed {...posts} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
  const username = context.params?.user;

  if (typeof username !== "string") throw new Error("Bad URL");

  await ssg.profiles.get.prefetch({ username });
  await ssg.posts.get.prefetch({ authorUsername: username });
  await ssg.reactions.get.prefetch({});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ssg = getSSGHelper();
  const profiles = await ssg.profiles.getAll.fetch({});

  return {
    paths: profiles.map((profile) => ({
      params: {
        user: profile.username ?? "",
      },
    })),
    fallback: "blocking",
  };
};

export default ProfilePage;
