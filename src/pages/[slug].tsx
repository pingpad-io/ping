import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { getSSGHelper } from "~/server/extra/getSSGHelper";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="card flex h-64 w-64 place-content-around items-center p-4">
          <h1 className="card-title text-error-content">User not found?</h1>
          <div className="card-actions justify-center">
            <Link className="btn-primary btn" href={"/"}>{`< Go back`}</Link>
          </div>
        </div>
      </div>
    );
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
              src={user.profileImageUrl}
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

  await ssg.profile.getUserByUsername.prefetch({ username });

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
