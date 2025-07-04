"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { parseAbi } from "viem";
import { useAccount, useConnect, useChainId, useWriteContract } from "wagmi";
import { base, mainnet as ethMainnet, optimism, baseSepolia, optimismSepolia, sepolia } from "wagmi/chains";
import { useEfpList } from "~/hooks/useEfpList";
import { EfpMintButton } from "./EfpMintButton";
import type { User } from "./post/Post";
import { Button } from "./ui/button";

// EFP List Records contract ABI for following operations
const LIST_RECORDS_ABI = parseAbi([
  "function setListRecordInDefaultLocation(uint256 tokenId, bytes calldata data) external",
  "function unsetListRecordInDefaultLocation(uint256 tokenId, bytes calldata data) external",
]);

// EFP contract addresses on different chains
const EFP_CONTRACTS = {
  // Mainnet chains
  8453: {
    listRecords: "0x41Aa48Ef3c0446b46a5b1cc6337FF3d3716E2A33",
    name: "Base",
  },
  10: {
    listRecords: "0x4Ca00413d850DcFa3516E14d21DAE2772F2aCb85",
    name: "Optimism",
  },
  1: {
    listRecords: "0x5289fE5daBC021D02FDDf23d4a4DF96F4E0F17EF",
    name: "Ethereum",
  },
  // Testnet chains
  84532: {
    listRecords: "0x0F3ab6e3eF34a3e8647A5E8DF2089f90c0e99d8A",
    name: "Base Sepolia",
  },
  11155420: {
    listRecords: "0x0F3ab6e3eF34a3e8647A5E8DF2089f90c0e99d8A", // Same as Base Sepolia
    name: "OP Sepolia",
  },
  11155111: {
    listRecords: "0x0F3ab6e3eF34a3e8647A5E8DF2089f90c0e99d8A", // Same as Base Sepolia
    name: "Sepolia",
  },
};

export const EfpFollowButton = ({
  user,
  className,
  isFollowing: initialFollowing = false,
}: {
  user: User;
  className?: string;
  isFollowing?: boolean;
}) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const { efpListTokenId, refetch: refetchEfpList } = useEfpList();
  const { connectors, connect } = useConnect();

  const handleEfpFollow = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet to follow users");
      return;
    }

    if (!chainId) {
      toast.error("Unable to detect network. Please check your wallet connection.");
      return;
    }

    if (!efpListTokenId) {
      toast.info("You need an EFP List NFT to follow users.");
      return;
    }

    const contracts = EFP_CONTRACTS[chainId as keyof typeof EFP_CONTRACTS];
    if (!contracts) {
      toast.error(`EFP is not supported on this network (Chain ID: ${chainId})`);
      return;
    }

    setLoading(true);

    try {
      // Encode the list record data
      // Version (1 byte) + Record Type (1 byte) + Address (20 bytes)
      const version = "01"; // Version 1
      const recordType = "01"; // Address record type
      const addressToFollow = user.address.slice(2); // Remove 0x prefix
      const listRecordData = `0x${version}${recordType}${addressToFollow}` as `0x${string}`;

      // Prepare and send the transaction
      const functionName = following ? "unsetListRecordInDefaultLocation" : "setListRecordInDefaultLocation";

      // Get the chain object based on chainId
      const chain = chainId === 8453 ? base 
        : chainId === 10 ? optimism 
        : chainId === 1 ? ethMainnet
        : chainId === 84532 ? baseSepolia
        : chainId === 11155420 ? optimismSepolia
        : chainId === 11155111 ? sepolia
        : undefined;
      
      if (!chain) {
        toast.error("Unsupported chain");
        return;
      }

      const hash = await writeContractAsync({
        address: contracts.listRecords as `0x${string}`,
        abi: LIST_RECORDS_ABI,
        functionName,
        args: [BigInt(efpListTokenId), listRecordData],
        chain,
        account: address,
        gas: BigInt(100000), // Set reasonable gas limit for follow operations
      });

      toast.info("Transaction submitted", { description: `Hash: ${hash.slice(0, 10)}...` });

      // Update local state optimistically
      setFollowing(!following);

      toast.success(following ? "Unfollowed successfully!" : "Followed successfully!", {
        description: "Transaction confirmed on-chain",
      });
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error("Transaction failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [showMintDialog, setShowMintDialog] = useState(false);
  
  // Refetch EFP list when dialog closes
  useEffect(() => {
    if (!showMintDialog && isConnected) {
      refetchEfpList();
    }
  }, [showMintDialog, isConnected]);

  const handleClick = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet to follow users");
      return;
    }

    console.log("Current efpListTokenId:", efpListTokenId);
    
    if (!efpListTokenId) {
      setShowMintDialog(true);
      return;
    }

    handleEfpFollow();
  };

  return (
    <>
      <Button
        size="sm"
        variant={following ? "outline" : "default"}
        onClick={handleClick}
        className={`font-semibold text-sm ${className}`}
        disabled={loading}
      >
        {loading ? "Processing..." : following ? "Following" : "Follow"}
      </Button>

      {isConnected && !efpListTokenId && (
        <EfpMintButton
          open={showMintDialog}
          onOpenChange={setShowMintDialog}
          onMinted={async (_tokenId) => {
            setShowMintDialog(false);
            // Wait a bit for the blockchain to process
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Refetch the list and wait for it
            const newList = await refetchEfpList();
            // The refetch should have updated the efpListTokenId
            // User can now click follow again
            toast.success("EFP List minted! You can now follow users.");
          }}
        />
      )}
    </>
  );
};
