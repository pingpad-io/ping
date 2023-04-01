import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import superjson from "superjson";
import { PageLayout } from "~/components/Layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) {
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

  return (
    <>
      <Head>
        <title>Twotter (@{data.username})</title>
      </Head>

      <PageLayout>
        <div className="divider"></div>
        <div className="flex flex-row items-center gap-4">
          <Image
            src={data.profileImageUrl}
            alt={`${username}'s profile image`}
            width={64}
            height={64}
            className="m-4 rounded-full"
          />
          <Link className="text-2xl" href={`/${data.username}`}>
            @{data.username}
          </Link>
        </div>
        <div className="divider"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

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
