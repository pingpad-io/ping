import { type NextPage } from "next";
import Feed from "~/components/Feed";
import Menu from "~/components/Menu";
import Sidebar from "~/components/Sidebar";

const Home: NextPage = () => {
  return (
    <>
      <main
        data-theme="dracula"
        className="flex min-h-screen flex-row place-content-center text-base-content"
      >
        <Menu />
        <Feed />
        <Sidebar />
      </main>
    </>
  );
};

export default Home;
