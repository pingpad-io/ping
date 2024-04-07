"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { LoginForm } from "./LoginForm";
import { truncateEthAddress } from "~/utils/truncateEthAddress";
import { LogoutButton } from "./LogoutButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DisconnectWalletButton } from "./WalletButton";

export function LensProfileSelect() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();

  if (!isConnected) return null;

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

