"use client";

import { Bookmark, Github, Heart, LogInIcon, PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PingLogo from "~/components/icons/PingLogo";
import { Dock } from "~/components/ui/dock";
import { cn } from "~/utils";
import { useNotifications } from "../notifications/NotificationsContext";
import PostComposer from "../post/PostComposer";
import { Dialog, DialogContent } from "../ui/dialog";
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

  const dockItems = isAuthenticated
    ? [
        {
          icon: PingLogo,
          label: "Home",
          onClick: () => router.push("/home"),
          isActive: pathname === "/home",
        },
        {
          customIcon: (
            <div className="relative w-full h-full flex items-center justify-center">
              {pathname === "/activity" ? (
                <Heart className="w-5 h-5 md:w-6 md:h-6 fill-current" strokeWidth={2.25} />
              ) : (
                <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.25} />
              )}
              {newCount > 0 && (
                <span className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] md:text-[10px] flex items-center justify-center font-medium">
                  {newCount > 9 ? "9+" : newCount}
                </span>
              )}
            </div>
          ),
          label: "Activity",
          onClick: () => router.push("/activity"),
          isActive: pathname === "/activity",
        },
        {
          icon: PlusIcon,
          label: "Post",
          onClick: () => setIsPostDialogOpen(true),
          variant: "secondary" as const,
        },
        {
          customIcon: (
            <div
              className={cn(
                "w-7 h-7 p-0 shrink-0 rounded-full overflow-hidden",
                (pathname === `/u/${handle}` || pathname.startsWith(`/u/${handle}/`)) &&
                  "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
              )}
            >
              <UserAvatar link={false} card={false} user={user} />
            </div>
          ),
          onClick: () => router.push(`/u/${handle}`),
          label: "Profile",
          extra: <UserMenuButtons handle={handle!} user={user} />,
          isActive: pathname === `/u/${handle}` || pathname.startsWith(`/u/${handle}/`),
        },
        {
          customIcon:
            pathname === "/bookmarks" ? (
              <Bookmark className="w-5 h-5 md:w-6 md:h-6 fill-current" strokeWidth={2.25} />
            ) : (
              <Bookmark className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.25} />
            ),
          label: "Bookmarks",
          onClick: () => router.push("/bookmarks"),
          isActive: pathname === "/bookmarks",
        },
        ...(isLandingPage
          ? [
              {
                icon: Github,
                label: "GitHub",
                onClick: () => window.open("https://github.com/pingpad-io/ping", "_blank"),
              },
            ]
          : []),
      ]
    : [
        {
          icon: PingLogo,
          label: "Home",
          onClick: () => router.push("/home"),
          isActive: pathname === "/home",
        },
        {
          icon: LogInIcon,
          label: "Connect Wallet",
          onClick: () => setIsWalletDialogOpen(true),
        },
        ...(isLandingPage
          ? [
              {
                icon: Github,
                label: "GitHub",
                onClick: () => window.open("https://github.com/pingpad-io/ping", "_blank"),
              },
            ]
          : []),
      ];

  return (
    <>
      <div className="fixed backdrop-blur-xl sm:backdrop-blur-none bottom-0 left-0 w-full sm:bottom-auto sm:top-1/2 sm:right-2 sm:left-auto sm:w-auto sm:-translate-y-1/2 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent pointer-events-none sm:hidden" />
        <div className="relative ">
          <Dock items={dockItems} />
        </div>
      </div>

      {isAuthenticated && (
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} modal={true}>
          <DialogContent className="max-w-full sm:max-w-[700px]">
            <PostComposer user={user} />
          </DialogContent>
        </Dialog>
      )}

      {!isAuthenticated && <ConnectWalletButton open={isWalletDialogOpen} setOpen={setIsWalletDialogOpen} />}
    </>
  );
}
