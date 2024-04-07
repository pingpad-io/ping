"use client";

import { WalletButton } from "./web3/WalletButton";
import { ConnectWalletButton } from "./web3/ConnectWalletButton";

const PingAuth = () => {
  return (
    <div className="px-4 pb-2 pt-4 dark:drop-shadow-glow drop-shadow-lg">
      <ConnectWalletButton />
    </div>
  );
};

export default PingAuth;
