import { fetchAccount } from "@lens-protocol/client/actions";
import {
  AtSign,
  BookmarkIcon,
  GavelIcon,
  GlobeIcon,
  MailIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "~/components/Link";
import { Button } from "~/components/ui/button";
import { getServerAuth } from "~/utils/getServerAuth";
import { ServerSignedIn } from "../auth/ServerSignedIn";
import PostWizard from "../post/PostWizard";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { User } from "../user/User";
import { lensAcountToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { ConnectWalletButton } from "../web3/WalletButtons";
import { NotificationButton } from "./NotificationButton";
import { SearchButton } from "./Search";

export default async function Menu() {
  const { handle, profileId, user } = await getServerAuth();
  const handleOrProfileId = handle ?? profileId;

  if (!profileId) {
    return (
      <div className="fixed h-fit bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-50">
        <div className="flex flex-row sm:flex-col items-center gap-4 md:gap-6 bg-background/80 backdrop-blur-md rounded-2xl">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <AtSign size={20} strokeWidth={2.5} />
            </Button>
          </Link>
          <div className="w-10">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-50">
      <div className="flex flex-row sm:flex-col items-center gap-4 md:gap-6 bg-background/80 backdrop-blur-md rounded-2xl">
        <Link href="/home">
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <AtSign size={20} strokeWidth={2.5} />
          </Button>
        </Link>

        <ServerSignedIn>
          <MenuAuthed handle={handleOrProfileId} user={user} />
        </ServerSignedIn>
      </div>
    </div>
  );
}

export const MenuAuthed = ({ handle, user }: { handle: string; user: User }) => {
  return (
    <>
      {/* <Link href="/settings">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <SettingsIcon size={20} strokeWidth={3} />
        </Button>
      </Link> */}

      <NotificationButton />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="w-10 h-10">
            <PlusIcon size={20} strokeWidth={2.5} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full sm:max-w-[700px]">
          <DialogTitle className="text-center">What's going on?</DialogTitle>
          <div className="pr-4">
            <PostWizard user={user} />
          </div>
        </DialogContent>
      </Dialog>

      <UserAvatarMenu handle={handle} />

      <Link href="/bookmarks">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <BookmarkIcon size={20} strokeWidth={2.5} />
        </Button>
      </Link>
    </>
  );
};

const UserAvatarMenu = async ({ handle }: { handle: string }) => {
  const { client, profileId } = await getServerAuth();

  const result = await fetchAccount(client, { address: profileId });
  const user = result.isOk() ? lensAcountToUser(result.value) : null;
  const handleOrProfileId = user?.handle ?? profileId;

  return (
    <Link href={`/u/${handleOrProfileId}`}>
      <Button variant="ghost" size="icon" className="w-10 h-10 p-1.5">
        <div className="w-7 h-7 rounded-lg overflow-hidden">
          <UserAvatar link={false} card={false} user={user} />
        </div>
      </Button>
    </Link>
  );
};
