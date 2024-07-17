"use client";

import { useLogout } from "@lens-protocol/react-web";
import { GlobeIcon, LogInIcon, UserMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { clearCookies } from "../../utils/clearCookies";
import { WalletConnectIcon } from "../Icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ConnectedWalletLabel } from "./ConnnectedWalletLabel";
import { LensProfileSelect } from "./LensProfileSelect";

export function ConnectWalletButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connectors, connect } = useConnect();
  const { isConnected: walletConnected } = useAccount();

  const connectorList = connectors.map((connector) => {
    if (connector.id !== "injected" && connector.id !== "walletConnect") return null;
    const name = connector.id === "injected" ? "Browser Wallet" : "Wallet Connect";
    const icon =
      connector.id === "injected" ? (
        <GlobeIcon key={connector.uid} strokeWidth={1.1} size={26} />
      ) : (
        <WalletConnectIcon key={connector.uid} />
      );
    return (
      <Button
        className="w-full flex flex-row justify-between"
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
    <Dialog onOpenChange={(open) => setDialogOpen(open)} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm_icon" onClick={(_e) => setDialogOpen(true)}>
          <div className="hidden sm:flex text-xl -mt-1">connect</div>
          <LogInIcon className="sm:ml-2" size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle>{!walletConnected ? "Select a wallet to connect" : "Select a Profile"}</DialogTitle>
          <DialogDescription>
            <ConnectedWalletLabel />
          </DialogDescription>
        </DialogHeader>

        {!walletConnected ? <>{connectorList}</> : <LensProfileSelect setDialogOpen={setDialogOpen} />}
      </DialogContent>
    </Dialog>
  );
}

export function DisconnectWalletButton(props: PropsWithChildren) {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null;
  }

  return (
    <Button variant="destructive" size="sm_icon" onClick={(_e) => disconnect()}>
      <div className="hidden sm:flex text-base">{props.children}</div>
    </Button>
  );
}

export function LogoutButton() {
  const { execute: disconnect } = useLogout();
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        if (isConnected) {
          disconnect();
        }
        await clearCookies();
        router.push("/home")
        router.refresh();
      }}
    >
      <UserMinusIcon size={20} className="sm:mr-2" />
      Log out
    </Button>
  );
}
