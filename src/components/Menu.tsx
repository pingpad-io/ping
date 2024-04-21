"use client";

import { Profile, SessionType, useSession } from "@lens-protocol/react-web";
import { AtSign, BellIcon, MailIcon, SearchIcon, SendIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext } from "react";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import { ConnectWalletButton } from "./web3/WalletButton";

export const CollapsedContext = createContext(false);

export default function Menu() {
  const _router = useRouter();
  const { data: session, error, loading } = useSession();
  const { isConnected: connected } = useAccount();

  if (loading) {
    return null;
  }

  if (error) {
    console.log(error);
    return null;
  }

  const authed = connected && session?.authenticated && session.type === SessionType.WithProfile;

  return (
    <span className="flex h-fit w-full sm:w-max shrink py-4 text-2xl px-4 sm:px-2 lg:w-56">
      <span className="flex h-fit flex-row sm:flex-col items-end gap-2 place-content-between sm:place-content-start w-full">
        <Link href="/home">
          <Button variant="ghost" size="sm_icon">
            <div className="hidden sm:flex">pingpad</div>
            <AtSign className="sm:ml-2" />
          </Button>
        </Link>

        <div className="flex flex-row sm:flex-col items-end gap-2 lg:hidden">
          {/* {pathname !== "/search" && ( */}
          <Link href={"/search"} className="xl:hidden text-2xl">
            <Button variant="ghost" size="sm_icon">
              <div className="hidden sm:flex text-2xl">search</div>
              <SearchIcon className="sm:ml-2" />
            </Button>
          </Link>
          {/* )} */}
        </div>

        {authed ? <MenuAuthed profile={session.profile} /> : <ConnectWalletButton />}
      </span>
    </span>
  );
}

export const MenuAuthed = ({ profile }: { profile: Profile }) => {
  const todo = () => {
    toast.error("coming soon™");
  };

  return (
    <>
      <Button variant="ghost" size="sm_icon" onClick={todo}>
        <div className="hidden sm:flex">messages</div>
        <MailIcon className="sm:ml-2" />
      </Button>

      <Button variant="ghost" size="sm_icon" onClick={todo}>
        <div className="hidden sm:flex">notifications</div>
        <BellIcon className="sm:ml-2" />
      </Button>

      <Link href="/settings">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex">settings</div>
          <SettingsIcon className="sm:ml-2" />
        </Button>
      </Link>

      {/* <Link href={`/u/${profile.handle.fullHandle.split("/")[1].toLowerCase()}`}> */}
        <Button variant="ghost" size="sm_icon" onClick={todo}>
          <div className="hidden sm:flex">profile</div>
          <UserIcon className="sm:ml-2" />
        </Button>
      {/* </Link> */}

      <Button onClick={todo}>
        <div className="hidden sm:flex">post</div>
        <SendIcon className="sm:ml-2" />
      </Button>
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button>
            <div className="hidden sm:flex">post</div>
            <SendIcon className="sm:ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full sm:max-w-[700px]">
          <div className="p-4">
            <PostWizard />
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
};
