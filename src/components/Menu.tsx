"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import {
  AtSign,
  BellIcon,
  LogInIcon,
  MailIcon,
  MessagesSquare,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext } from "react";
import { Button } from "~/components/ui/button";
import PingAuth from "./Auth";
import PostWizard from "./PostWizard";
import { Profile, SessionType, useSession } from "@lens-protocol/react-web";
import { ConnectWalletButton } from "./web3/ConnectWalletButton";

export const CollapsedContext = createContext(false);

export default function Menu() {
  const router = useRouter();
  const { data: session, error, loading } = useSession();

  if (loading || error) return null;

  const authed = session.authenticated && session.type === SessionType.WithProfile;

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
          <Link href={"/t"} className="xl:hidden text-2xl">
            <Button variant="ghost" size="sm_icon" className="xl:hidden">
              <div className="hidden sm:flex text-2xl">threads</div>
              <MessagesSquare className="sm:ml-2" />
            </Button>
          </Link>
        </div>

        {authed ? (
          <MenuAuthed profile={session.profile} />
        ) : (
          <>
            <ConnectWalletButton />
          </>
        )}
      </span>
    </span>
  );
}

export const MenuAuthed = ({ profile }: { profile: Profile }) => {
  return (
    <>
      <Link href="/c">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex">messages</div>
          <MailIcon className="sm:ml-2" />
        </Button>
      </Link>

      <Link href="/notifications">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex">notifications</div>
          <BellIcon className="sm:ml-2" />
        </Button>
      </Link>

      <Link href="/settings">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex">settings</div>
          <SettingsIcon className="sm:ml-2" />
        </Button>
      </Link>

      <Link
        href={{
          pathname: "/",
          query: `${profile.handle}`,
        }}
      >
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex">profile</div>
          <UserIcon className="sm:ml-2" />
        </Button>
      </Link>

      <Dialog>
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
      </Dialog>
    </>
  );
};
