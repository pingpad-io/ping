import { AtSign, BookmarkIcon, PlusIcon } from "lucide-react";
import Link from "~/components/Link";
import { Button } from "~/components/ui/button";
import { getServerAuth } from "~/utils/getServerAuth";
import { ServerSignedIn } from "../auth/ServerSignedIn";
import { NotificationButton } from "../notifications/NotificationButton";
import PostWizard from "../post/PostWizard";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { User } from "../user/User";
import { ConnectWalletButton } from "../web3/WalletButtons";
import { SearchButton } from "./Search";
import { UserMenu } from "./UserMenu";

export default async function Menu() {
  const { handle, profileId, user } = await getServerAuth();
  const handleOrProfileId = handle ?? profileId;

  return (
    <div className="fixed bottom-0 left-0 w-full p-2 pb-6 sm:bottom-auto sm:top-1/2 sm:right-0 sm:left-auto sm:w-auto sm:-translate-y-1/2 sm:p-2 z-50 bg-background/80 backdrop-blur-md rounded-2xl">
      <div className="flex flex-row sm:flex-col items-center justify-around sm:justify-center gap-6 sm:gap-6">
        <Link href="/home" className="flex-shrink-0">
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <AtSign size={20} strokeWidth={2.5} />
          </Button>
        </Link>

        {!profileId ? (
          <div className="w-12 flex-shrink-0">
            <ConnectWalletButton />
          </div>
        ) : (
          <ServerSignedIn>
            <div className="flex-shrink-0">
              <NotificationButton />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon" className="w-12 h-12 flex-shrink-0">
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

            <div className="flex-shrink-0">
              <UserMenu handle={handleOrProfileId} user={user} />
            </div>

            <Link href="/bookmarks" className="flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-12 h-12">
                <BookmarkIcon size={20} strokeWidth={2.5} />
              </Button>
            </Link>
          </ServerSignedIn>
        )}
      </div>
    </div>
  );
}
