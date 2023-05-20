import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getProfileByUsername.useQuery({
    username,
  });

  if (!user) {
    return <ErrorPage title="∑(O_O;) Not Found " />;
  }

  const posts = api.posts.getAllByUserId.useQuery(user.id);
  const title = `Twotter (@${user.username})`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageLayout>
        <div className="m-4 flex flex-row items-center gap-4 rounded-3xl border border-base-300 p-2">
          <div className="avatar">
            <Image
              src={user.avatar_url}
              alt={`${username}'s profile image`}
              width={64}
              height={64}
              className="m-4 rounded-full ring-2 ring-base-300"
            />
          </div>
          <Link className="text-2xl" href={`/${user.username}`}>
            @{user.username}
          </Link>
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
