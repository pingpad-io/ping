import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Feed from "~/components/Feed";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Menu from "~/components/Menu";
import Threads from "~/components/Threads";

const Home: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Twotter?</title>
        <meta name="description" content="an anonymised twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-row place-content-center">
        <Menu />
        <Feed />
        <Threads />
      </main>
    </>
  );
};

export default Home;
