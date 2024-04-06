"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { Button } from "../ui/button";
import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { LoginForm } from "./LoginForm";
import { truncateEthAddress } from "~/utils/truncateEthAddress";
import { LogoutButton } from "./LogoutButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function WalletButton() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();

  // connect wallet
  if (!isConnected) {
    return <ConnectWalletButton />;
  }

  // connect Lens Profile
  if (!session?.authenticated && address) {
    return (
      <Dialog>
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Lens Profile to login with.</DialogTitle>
              <DialogDescription>
                <p className="mb-4">Connected wallet: {truncateEthAddress(address)}</p>
                <LoginForm owner={address} />
                <div className="mt-2">
                  <DisconnectWalletButton />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </Dialog>
    );
  }

  // show profile details
  if (session && session.type === SessionType.WithProfile) {
    return (
      <>
        <p className="mb-4">
          You are logged in as{" "}
          <span className="font-semibold">{session.profile.handle?.fullHandle ?? session.profile.id}</span>
        </p>
        <LogoutButton />
      </>
    );
  }
}

export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return <Button onClick={show}>{isConnected ? truncatedAddress : "Connect Wallet"}</Button>;
      }}
    </ConnectKitButton.Custom>
  );
}

export function DisconnectWalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    disconnect();
  };

  if (!isConnected) {
    return null;
  }

  return <Button onClick={handleClick}>Disconnect</Button>;
}
