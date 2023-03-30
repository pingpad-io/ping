import { type NextPage } from "next";
import Head from "next/head";
import Feed from "~/components/Feed";
import Menu from "~/components/Menu";
import Sidebar from "~/components/Sidebar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twotter</title>
        <meta name="description" content="an anonymised twitter" />
        <link rel="icon" href="/otterino.svg" />
      </Head>

      <main className="flex min-h-screen flex-row place-content-center text-primary-content">
        <Menu />
        <Feed />
        <Sidebar />
      </main>
    </>
  );
};

export default Home;
