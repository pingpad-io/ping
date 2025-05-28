"use client";

import { LogOutIcon, UserIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "~/components/Link";
import { clearCookies } from "~/utils/clearCookies";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
          <Button variant="ghost" size="icon" className="w-10 h-10 p-1.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-2 text-destructive focus:text-destructive" onSelect={logout}>
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
