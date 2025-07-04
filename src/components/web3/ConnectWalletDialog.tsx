"use client";

import { useAuth } from "~/hooks/useAuth";
import { ConnectWalletButton } from "./WalletButtons";

export function ConnectWalletDialog() {
  const { isWalletDialogOpen, closeWalletDialog } = useAuth();

  return <ConnectWalletButton open={isWalletDialogOpen} setOpen={closeWalletDialog} />;
}
