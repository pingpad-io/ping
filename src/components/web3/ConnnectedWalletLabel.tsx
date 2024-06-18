"use client";

import { LogOutIcon } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { Address } from "./Address";

export const ConnectedWalletLabel = () => {
  const { isConnected: walletConnected, address } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();

  if (!walletConnected) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      Connected wallet: <Address address={address} />
      <Button size="icon" className="w-4 h-4" variant="ghost" onClick={() => disconnectWallet()}>
        <LogOutIcon />
      </Button>
    </div>
  );
};
