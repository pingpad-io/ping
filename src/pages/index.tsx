import { SignIn, SignInButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Twotter</title>
        <meta name="description" content="an anonymised twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /> */}
        <SignInButton />
      </main>
    </>
  );
};

export default Home;
