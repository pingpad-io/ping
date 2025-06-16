"use client";

import { Bell, BookmarkIcon, Github, LogInIcon, PlusIcon } from "lucide-react";
import PingLogo from "~/components/icons/PingLogo";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dock } from "~/components/ui/dock";
import { useNotifications } from "../notifications/NotificationsContext";
import PostWizard from "../post/PostWizard";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UserAvatar } from "../user/UserAvatar";
import { ConnectWalletButton } from "../web3/WalletButtons";
import { UserMenuButtons } from "./UserMenu";

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
  const pathname = usePathname();
  const { newCount } = useNotifications();
  const isLandingPage = pathname === "/";

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
        icon: PingLogo,
        label: "Home",
        onClick: () => router.push("/home"),
      },
      {
        icon: LogInIcon,
        label: "Connect Wallet",
        onClick: () => setIsWalletDialogOpen(true),
      },
      ...(isLandingPage ? [{
        icon: Github,
        label: "GitHub",
        onClick: () => window.open("https://github.com/pingpad-io/ping", "_blank"),
      }] : []),
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
      icon: PingLogo,
      label: "Home",
      onClick: () => router.push("/home"),
    },
    {
      customIcon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <Bell className="w-5 h-5" />
          {newCount > 0 && (
            <span className="absolute -bottom-3 -right-3 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-medium">
              {newCount > 9 ? "9+" : newCount}
            </span>
          )}
        </div>
      ),
      label: "Notifications",
      onClick: () => router.push("/notifications"),
    },
    {
      icon: PlusIcon,
      label: "Create Post",
      onClick: () => setIsPostDialogOpen(true),
      variant: "secondary" as const,
    },
    {
      customIcon: (
        <div className="w-full h-full rounded-md overflow-hidden">
          <UserAvatar link={false} card={false} user={user} />
        </div>
      ),
      label: "Profile",
      extra: <UserMenuButtons handle={handle!} user={user} />,
    },
    {
      icon: BookmarkIcon,
      label: "Bookmarks",
      onClick: () => router.push("/bookmarks"),
    },
    ...(isLandingPage ? [{
      icon: Github,
      label: "GitHub",
      onClick: () => window.open("https://github.com/pingpad-io/ping", "_blank"),
    }] : []),
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
