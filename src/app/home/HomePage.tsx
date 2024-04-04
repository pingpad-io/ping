"use client";

import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { ConnectWalletButton, DisconnectWalletButton, WalletButton } from "~/components/web3/WalletButton";
import { LoginForm } from "~/components/web3/LoginForm";
import { LogoutButton } from "~/components/web3/LogoutButton";
import { truncateEthAddress } from "~/utils/truncateEthAddress";

export const HomePage = () => {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();

  return <WalletButton />;
};
