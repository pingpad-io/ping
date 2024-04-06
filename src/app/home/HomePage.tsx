"use client";

import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount, useWalletClient } from "wagmi";
import { ConnectWalletButton, DisconnectWalletButton, WalletButton } from "~/components/web3/WalletButton";

export const HomePage = () => {
  // const { isConnected, address, connector, status } = useWagmiAccount();
  const { data: session } = useLensSession();
  // const { data: wallet } = useWalletClient();


  if (!session || !(session.type === SessionType.WithProfile)) {
    return (
      <div>
        <WalletButton />
      </div>
    );
  }
  const handle = session.profile.handle.fullHandle;

  const fetchPosts = async () => {
    const response = await fetch(`/api/feed?handle=${handle}`, {method: "GET"});
    const posts = await response.json();
    console.log(posts);
  };

  fetchPosts();

  return (
    <>
      <WalletButton />;
    </>
  );
};
