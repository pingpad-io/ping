import { AtSign, BellIcon, MailIcon, SearchIcon, SendIcon, SettingsIcon, UserIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ConnectWalletButton } from "./web3/WalletButtons";

export default function Menu() {
  const cookieStore = cookies();
  const handle = cookieStore.get("handle")?.value;
  const profileId = cookieStore.get("profileId")?.value;
  const handleOrProfileId = handle ?? profileId;

  if (!profileId) {
    return (
      <span className="flex shrink text-xl p-4 sm:px-2 w-full sm:w-max">
        <span className="flex flex-row sm:flex-col items-end gap-2 place-content-between sm:place-content-start w-full">
          <Link href="/home">
            <Button variant="ghost" size="sm_icon">
              <span className="hidden sm:flex -mt-1">pingpad</span>
              <AtSign className="sm:ml-2" size={20} />
            </Button>
          </Link>
        </span>
      </span>
    );
  }

  return (
    <span className="flex shrink text-xl p-4 sm:px-2 w-full sm:w-max">
      <span className="flex flex-row sm:flex-col items-end gap-2 place-content-between sm:place-content-start w-full">
        <Link href="/home">
          <Button variant="ghost" size="sm_icon">
            <div className="hidden sm:flex -mt-1">pingpad</div>
            <AtSign className="sm:ml-2" size={20} />
          </Button>
        </Link>

        <div className="flex flex-row sm:flex-col items-end gap-2 lg:hidden">
          {/* {pathname !== "/search" && ( */}
          <Link href={"/search"} className="xl:hidden">
            <Button variant="ghost" size="sm_icon">
              <div className="hidden sm:flex -mt-1">search</div>
              <SearchIcon className="sm:ml-2" size={20} />
            </Button>
          </Link>
          {/* )} */}
        </div>

        {profileId ? <MenuAuthed handle={handleOrProfileId} /> : <ConnectWalletButton />}
      </span>
    </span>
  );
}

export const MenuAuthed = ({ handle }: { handle: string }) => {
  return (
    <>
      <Button variant="ghost" size="sm_icon" disabled>
        <div className="hidden sm:flex -mt-1">messages</div>
        <MailIcon className="sm:ml-2" size={20} />
      </Button>

      <Button variant="ghost" size="sm_icon" disabled>
        <div className="hidden sm:flex -mt-1">notifications</div>
        <BellIcon className="sm:ml-2" size={21} />
      </Button>

      <Link href="/settings">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">settings</div>
          <SettingsIcon className="sm:ml-2" size={20} />
        </Button>
      </Link>

      <Link href={`/u/${handle}`}>
        <Button variant="ghost" size="sm_icon" disabled>
          <div className="hidden sm:flex -mt-1">profile</div>
          <UserIcon className="sm:ml-2" size={21} />
        </Button>
      </Link>

      <Button disabled>
        <div className="hidden sm:flex -mt-1">post</div>
        <SendIcon className="sm:ml-2" size={20} />
      </Button>
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button>
            <div className="hidden sm:flex -mt-1">post</div>
            <SendIcon className="sm:ml-2" size={20} />
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
