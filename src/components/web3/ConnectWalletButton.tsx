"use client";
import { ConnectKitButton } from "connectkit";
import { Button } from "../ui/button";

export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return <Button onClick={show}>{isConnected ? truncatedAddress : "Connect Wallet"}</Button>;
      }}
    </ConnectKitButton.Custom>
  );
}
