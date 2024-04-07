"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "../ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";

export function ConnectWalletButton() {
  const { open: openModal, close: closeModal } = useWeb3Modal();

  return (
    <Button size="sm_icon" onClick={(e) => openModal()}>
      <div className="hidden sm:flex text-2xl">connect</div>
      <LogInIcon className="sm:ml-2" />
    </Button>
  );
}

export function DisconnectWalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm_icon" onClick={(e) => disconnect()}>
      <div className="hidden sm:flex text-base">disconnect</div>
      <LogOutIcon className="sm:ml-2" />
    </Button>
  );
}
