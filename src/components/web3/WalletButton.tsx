"use client";

import { useLogout } from "@lens-protocol/react-web";
import { GlobeIcon, LogInIcon } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { WalletConnectIcon } from "../Icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function ConnectWalletButton() {
  const { connectors, connect } = useConnect();

  const connectorList = connectors.map((connector) => {
    if (connector.id !== "injected" && connector.id !== "walletConnect") return null;
    const name = connector.id === "injected" ? "Browser Wallet" : "Wallet Connect";
    const icon = connector.id === "injected" ? <GlobeIcon strokeWidth={1.1} size={26} /> : <WalletConnectIcon />;
    return (
      <Button
        className="w-56  flex flex-row justify-between"
        variant="outline"
        key={connector.uid}
        onClick={() => connect({ connector })}
      >
        {name}
        {icon}
      </Button>
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm_icon">
          <div className="hidden sm:flex text-2xl">connect</div>
          <LogInIcon className="sm:ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>Select a wallet to connect</DialogTitle>

          <DialogDescription>{/*  */}</DialogDescription>
        </DialogHeader>

        {connectorList}
      </DialogContent>
    </Dialog>
  );
}

export function DisconnectWalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm_icon" onClick={(_e) => disconnect()}>
      <div className="hidden sm:flex text-base">Cancel</div>
    </Button>
  );
}

export function LogoutButton() {
  const { isConnected: walletConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { execute: disconnectLens } = useLogout();

  if (!walletConnected) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        disconnectLens();
        disconnectWallet();
      }}
    >
      Log out
    </Button>
  );
}
