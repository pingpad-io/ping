"use client";

import { AtSign, BookmarkIcon, PlusIcon, Bell, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dock } from "~/components/ui/dock";
import PostWizard from "../post/PostWizard";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UserAvatar } from "../user/UserAvatar";
import { ConnectWalletButton } from "../web3/WalletButtons";

interface MenuClientProps {
  isAuthenticated: boolean;
  handle?: string | null;
  profileId?: string | null;
  user: any;
}

export function Menu({ isAuthenticated, handle, profileId, user }: MenuClientProps) {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/home");
    router.prefetch("/bookmarks");
    if (handle) {
      router.prefetch(`/u/${handle}`);
    }
  }, [router, handle]);

  if (!isAuthenticated) {
    const dockItems = [
      {
        icon: AtSign,
        label: "Home",
        onClick: () => router.push("/home")
      },
      {
        icon: LogInIcon,
        label: "Connect Wallet",
        onClick: () => setIsWalletDialogOpen(true)
      }
    ];

    return (
      <>
        <div className="fixed bottom-0 left-0 w-full p-2 pb-6 sm:bottom-auto sm:top-1/2 sm:right-2 sm:left-auto sm:w-auto sm:-translate-y-1/2 sm:p-2 z-50">
          <Dock items={dockItems} />
        </div>

        <ConnectWalletButton open={isWalletDialogOpen} setOpen={setIsWalletDialogOpen} />
      </>
    );
  }

  const dockItems = [
    {
      icon: AtSign,
      label: "Home",
      onClick: () => router.push("/home")
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => { }
    },
    {
      icon: PlusIcon,
      label: "Create Post",
      onClick: () => setIsPostDialogOpen(true)
    },
    {
      customIcon: (
        <div className="w-full h-full rounded-md overflow-hidden">
          <UserAvatar link={false} card={false} user={user} />
        </div>
      ),
      label: "Profile",
      onClick: () => router.push(`/u/${handle}`)
    },
    {
      icon: BookmarkIcon,
      label: "Bookmarks",
      onClick: () => router.push("/bookmarks")
    }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full p-2 pb-6 sm:bottom-auto sm:top-1/2 sm:right-2 sm:left-auto sm:w-auto sm:-translate-y-1/2 sm:p-2 z-50">
        <Dock items={dockItems} />
      </div>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} modal={true}>
        <DialogContent className="max-w-full sm:max-w-[700px]">
          <DialogTitle className="text-center">What's going on?</DialogTitle>
          <div className="pr-4">
            <PostWizard user={user} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}