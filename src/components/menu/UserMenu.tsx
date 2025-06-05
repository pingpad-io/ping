"use client";

import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, UserIcon, UsersIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "~/components/Link";
import { clearCookies } from "~/utils/clearCookies";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { User } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { LensProfileSelect } from "../web3/LensProfileSelect";

export function UserMenu({
  handle,
  user,
}: {
  handle: string;
  user: User;
}) {
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
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-12 h-12 p-1.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <UserAvatar link={false} card={false} user={user} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col w-40 gap-1 p-1 border">
          <Link href={`/u/${handle}`}>
            <DropdownMenuItem className="flex gap-2">
              <UserIcon size={16} />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="flex gap-2" onSelect={() => setDialogOpen(true)}>
            <UsersIcon size={16} />
            Switch Profile
          </DropdownMenuItem>
          <Link href="/settings">
            <DropdownMenuItem className="flex gap-2">
              <SettingsIcon size={16} />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="flex gap-2" onSelect={toggleTheme}>
            {theme === "light" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            Toggle Theme
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2" onSelect={logout}>
            <LogOutIcon size={16} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Profile</DialogTitle>
        </DialogHeader>
        <LensProfileSelect setDialogOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function UserMenuDropdown({ handle, user }: { handle: string; user: User }) {
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
      <div className="flex flex-col w-40 gap-1 p-1">
        <Link href={`/u/${handle}`}>
          <DropdownMenuItem className="flex gap-2">
            <UserIcon size={16} />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="flex gap-2" onSelect={() => setDialogOpen(true)}>
          <UsersIcon size={16} />
          Switch Profile
        </DropdownMenuItem>
        <Link href="/settings">
          <DropdownMenuItem className="flex gap-2">
            <SettingsIcon size={16} />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="flex gap-2" onSelect={toggleTheme}>
          {theme === "light" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          Toggle Theme
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onSelect={logout}>
          <LogOutIcon size={16} />
          Log out
        </DropdownMenuItem>
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

export function UserMenuButtons({ handle, user }: { handle: string; user: User }) {
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
      <div className="flex flex-col w-40 gap-1 p-1">
        <Link href={`/u/${handle}`}>
          <button type="button" className="flex gap-2 items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/70 transition-colors">
            <UserIcon size={16} />
            Profile
          </button>
        </Link>
        <button
          type="button"
          className="flex gap-2 items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/70 transition-colors"
          onClick={() => setDialogOpen(true)}
        >
          <UsersIcon size={16} />
          Switch Profile
        </button>
        <Link href="/settings">
          <button type="button" className="flex gap-2 items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/70 transition-colors">
            <SettingsIcon size={16} />
            Settings
          </button>
        </Link>
        <button
          type="button"
          className="flex gap-2 items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/70 transition-colors"
          onClick={toggleTheme}
        >
          {theme === "light" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          Toggle Theme
        </button>
        <button
          type="button"
          className="flex gap-2 items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/70 transition-colors"
          onClick={logout}
        >
          <LogOutIcon size={16} />
          Log out
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
