import { AtSign, BellIcon, BookmarkIcon, GlobeIcon, MailIcon, SendIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getCookieAuth } from "~/utils/getCookieAuth";
import { ConnectWalletButton } from "../web3/WalletButtons";
import { SearchButton } from "./Search";

export default function Menu() {
  const { handle, profileId } = getCookieAuth();
  const handleOrProfileId = handle ?? profileId;

  const logo = (
    <Link href="/">
      <Button variant="ghost" size="sm_icon">
        <span className="hidden sm:flex -mt-1">pingpad</span>
        <AtSign className="sm:ml-2" size={20} />
      </Button>
    </Link>
  );

  if (!profileId) {
    return (
      <span className="flex shrink text-xl p-4 sm:px-2 w-full sm:w-max">
        <span className="flex flex-row sm:flex-col items-end gap-2 place-content-between sm:place-content-start w-full">
          {logo}
          <ConnectWalletButton />
        </span>
      </span>
    );
  }

  return (
    <span className="flex shrink text-xl p-4 sm:px-2 w-full sm:w-max">
      <span className="flex flex-row sm:flex-col items-end gap-2 place-content-between sm:place-content-start w-full">
        {logo}
        <SearchButton />

        <MenuAuthed handle={handleOrProfileId} />
      </span>
    </span>
  );
}

export const MenuAuthed = ({ handle }: { handle: string }) => {
  return (
    <>
      <Link href={"/explore"}>
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">explore</div>
          <GlobeIcon className="sm:ml-2" size={21} />
        </Button>
      </Link>

      <Link href={"/notifications"}>
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">notifications</div>
          <BellIcon className="sm:ml-2" size={21} />
        </Button>
      </Link>

      <Link href={"/bookmarks"}>
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">bookmarks</div>
          <BookmarkIcon className="sm:ml-2" size={21} />
        </Button>
      </Link>

      <Link href="/settings">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">settings</div>
          <SettingsIcon className="sm:ml-2" size={20} />
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
