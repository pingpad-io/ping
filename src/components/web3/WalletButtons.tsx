"use client";

import { useLogout } from "@lens-protocol/react";
import { UserMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { clearCookies } from "../../utils/clearCookies";
import { FamilyIcon, GlobeIcon, WalletConnectIcon } from "../Icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ConnectedWalletLabel } from "./ConnnectedWalletLabel";
import { LensProfileSelect } from "./LensProfileSelect";

interface ConnectWalletButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ConnectWalletButton({ open, setOpen }: ConnectWalletButtonProps) {
  const { connectors, connect } = useConnect({
    mutation: {
      onError: (error) => {
        toast.error("Connection Failed", { description: error.message });

        setOpen(false);
      },
    },
  });
  const { isConnected: walletConnected } = useAccount();

  const connectorList = connectors.map((connector) => {
    if (connector.id !== "injected" && connector.id !== "walletConnect" && connector.id !== "familyAccountsProvider")
      return null;

    let name: string;
    let icon: JSX.Element;

    if (connector.id === "injected") {
      name = "Browser Wallet";
      icon = (
        <div className="w-5 h-5">
          <GlobeIcon key={connector.uid} />
        </div>
      );
    } else if (connector.id === "walletConnect") {
      name = "Wallet Connect";
      icon = <WalletConnectIcon key={connector.uid} />;
    } else if (connector.id === "familyAccountsProvider") {
      name = "Continue with Family";
      icon = (
        <div className="w-5 h-5">
          <FamilyIcon key={connector.uid} />
        </div>
      );
    } else {
      return null;
    }

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
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent className="max-w-sm flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle>{!walletConnected ? "Select a wallet to connect" : "Select a Profile"}</DialogTitle>
          <DialogDescription>
            <ConnectedWalletLabel />
          </DialogDescription>
        </DialogHeader>

        {!walletConnected ? connectorList : <LensProfileSelect setDialogOpen={setOpen} />}
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
  const { disconnect: disconnectWallet } = useDisconnect();
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        if (isConnected) {
          // disconnect();
          disconnectWallet();
        }
        await clearCookies();
        router.push("/home");
        router.refresh();
      }}
    >
      <UserMinusIcon size={20} className="sm:mr-2" />
      Log out
    </Button>
  );
}
