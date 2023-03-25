import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>loading...</div>;
  if (!data) return <div>something went wrong... terribly wrong...</div>;

  return (
    <>
      <Head>
        <title>Twotter</title>
        <meta name="description" content="an anonymised twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="dark flex min-h-screen flex-col items-center justify-center">
        {user.isSignedIn && <SignOutButton />}
        {!user.isSignedIn && <SignInButton />}

        <div>
          {data?.map((post) => (
            <div className="animate-pulse" key={post.id}>
              {post.content}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
