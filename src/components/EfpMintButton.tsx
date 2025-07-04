"use client";

import { useState } from "react";
import { toast } from "sonner";
import { parseAbi } from "viem";
import { useAccount, useConnect, useWriteContract, useChainId, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { base, mainnet as ethMainnet, optimism, baseSepolia, optimismSepolia, sepolia } from "wagmi/chains";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// EFP List Minter contract ABI
const LIST_MINTER_ABI = parseAbi([
  "function mint(bytes calldata) external returns (uint256)",
  "function mintAndRegisterKeysForEthereumAddress(address recipient, address list) external returns (uint256)",
  "function mint() external returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

// EFP Minter contract addresses on different chains
const EFP_MINTER_CONTRACTS = {
  // Mainnet chains
  8453: {
    listMinter: "0xDb17Bfc64aBf7B7F080a49f0Bbbf799dDbb48Ce5",
    name: "Base",
  },
  10: {
    listMinter: "0xDb17Bfc64aBf7B7F080a49f0Bbbf799dDbb48Ce5", // Same address as Base
    name: "Optimism",
  },
  1: {
    listMinter: "0xDb17Bfc64aBf7B7F080a49f0Bbbf799dDbb48Ce5", // Same address as Base
    name: "Ethereum",
  },
  // Testnet chains
  84532: {
    listMinter: "0x0c3301561B8e132fe18d97E69d95F5f1F2849f9b",
    name: "Base Sepolia",
  },
  11155420: {
    listMinter: "0x0c3301561B8e132fe18d97E69d95F5f1F2849f9b", // Same address as Base Sepolia
    name: "OP Sepolia",
  },
  11155111: {
    listMinter: "0x0c3301561B8e132fe18d97E69d95F5f1F2849f9b", // Same address as Base Sepolia
    name: "Sepolia",
  },
};

export const EfpMintButton = ({
  onMinted,
  className,
  open,
  onOpenChange,
}: {
  onMinted?: (tokenId: string) => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<string>("");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { connectors, connect } = useConnect();

  // Use controlled state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : showDialog;
  const setIsOpen = onOpenChange || setShowDialog;

  // Determine if we're on testnet based on current chain
  const isTestnet = chainId === 84532 || chainId === 11155420 || chainId === 11155111;
  const availableChains = isTestnet 
    ? [84532, 11155420, 11155111] // Testnet chains
    : [8453, 10, 1]; // Mainnet chains

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet to mint an EFP List");
      return;
    }

    if (!selectedChainId) {
      toast.error("Please select a network to mint on");
      return;
    }

    const targetChainId = Number(selectedChainId);
    const contracts = EFP_MINTER_CONTRACTS[targetChainId as keyof typeof EFP_MINTER_CONTRACTS];
    if (!contracts) {
      toast.error(`EFP minting is not supported on this network`);
      return;
    }

    // Check if user is on the correct chain
    if (chainId !== targetChainId) {
      toast.error(`Please switch to ${contracts.name} to mint`);
      return;
    }

    setLoading(true);

    try {
      // Mint the EFP List NFT
      // This creates a list where the minter is the owner, manager, and user
      // Get the chain object based on selected chain
      const chain = targetChainId === 8453 ? base 
        : targetChainId === 10 ? optimism 
        : targetChainId === 1 ? ethMainnet
        : targetChainId === 84532 ? baseSepolia
        : targetChainId === 11155420 ? optimismSepolia
        : targetChainId === 11155111 ? sepolia
        : undefined;
      
      if (!chain) {
        toast.error("Unsupported chain");
        return;
      }

      // Use the simpler mint function which should have lower gas costs
      const hash = await writeContractAsync({
        address: contracts.listMinter as `0x${string}`,
        abi: LIST_MINTER_ABI,
        functionName: "mint",
        args: [],
        chain,
        account: address,
      });

      toast.info("Minting EFP List...", {
        description: `Transaction: ${hash.slice(0, 10)}...`,
      });

      // Wait for transaction confirmation
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 2,
        });
        
        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted');
        }
      }
      
      // Additional delay to ensure indexing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("EFP List minted successfully!", {
        description: "You can now follow users using EFP",
      });

      setIsOpen(false);
      setSelectedChainId("");
      onMinted?.("1"); // The hook will fetch the actual token ID
    } catch (error) {
      console.error("Error minting EFP List:", error);
      toast.error("Failed to mint EFP List", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your EFP List</DialogTitle>
          <DialogDescription className="space-y-3">
            <p>To follow users on the Ethereum Follow Protocol, you need an EFP List.</p>
            <p>This is a one-time setup that allows you to manage your on-chain social graph.</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Free to mint (plus gas fees)</li>
              <li>Works across all EFP-enabled apps</li>
              <li>You own and control your follow list</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Network</label>
            <Select value={selectedChainId} onValueChange={setSelectedChainId}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choose a network" />
              </SelectTrigger>
              <SelectContent>
                {availableChains.map((id) => {
                  const contract = EFP_MINTER_CONTRACTS[id as keyof typeof EFP_MINTER_CONTRACTS];
                  return (
                    <SelectItem key={id} value={id.toString()}>
                      {contract.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleMint} disabled={loading || !isConnected || !selectedChainId} className="w-full">
            {loading ? "Minting..." : "Mint EFP List"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
