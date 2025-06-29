"use client";

import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, UserIcon, UsersIcon, UsersRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "~/components/Link";
import { clearCookies } from "~/utils/clearCookies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { User } from "../user/User";
import { LensProfileSelect } from "../web3/LensProfileSelect";

export function UserMenuButtons({ handle }: { handle: string; user: User }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  const logout = async () => {
    if (isConnected) {
      disconnectWallet();
    }
    await clearCookies();
    router.push("/home");
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col w-48 p-1">
        <Link href={`/u/${handle}`} className="relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
          <UserIcon size={16} />
          <span className="ml-3">Profile</span>
        </Link>
        <button
          type="button"
          className="relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
          onClick={() => setDialogOpen(true)}
        >
          <UsersRoundIcon size={16} />
          <span className="ml-3">Switch Profile</span>
        </button>
        <Link href="/settings" className="relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
          <SettingsIcon size={16} />
          <span className="ml-3">Settings</span>
        </Link>
        <button
          type="button"
          className="relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
          onClick={toggleTheme}
        >
          {theme === "light" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          <span className="ml-3">Theme</span>
        </button>
        <button
          type="button"
          className="relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
          onClick={logout}
        >
          <LogOutIcon size={16} />
          <span className="ml-3">Log out</span>
        </button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Profile</DialogTitle>
          </DialogHeader>
          <LensProfileSelect setDialogOpen={setDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
