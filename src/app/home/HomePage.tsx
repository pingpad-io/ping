"use client";

import { LensClient, production } from "@lens-protocol/client";
import { LimitType, SessionType, useFeed, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount, useWalletClient } from "wagmi";
import { Feed } from "~/components/Feed";
import { DisconnectWalletButton, WalletButton } from "~/components/web3/WalletButton";
import { ConnectWalletButton } from "~/components/web3/ConnectWalletButton";

export const HomePage = () => {
  // const { isConnected, address, connector, status } = useWagmiAccount();
  const { data: session } = useLensSession();
  const { data: wallet } = useWalletClient();

  if (!session || !(session.type === SessionType.WithProfile)) {
    return (
      <div>
        <WalletButton />
      </div>
    );
  }

  return (
    <>
      <Feed profileId={session.profile.id} />
    </>
  );
};
