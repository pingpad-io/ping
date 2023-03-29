import { type NextPage } from "next";
import Menu from "~/components/Menu";
import Profile from "~/components/Profile";
import Sidebar from "~/components/Sidebar";

const ProfilePage: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-row place-content-center">
        <Menu />
        <Profile />
        <Sidebar />
      </main>
    </>
  );
};

export default ProfilePage;
