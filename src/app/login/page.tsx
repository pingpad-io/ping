"use client";

import type { Account } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { FamilyIcon, GlobeIcon, WalletConnectIcon } from "~/components/Icons";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserAvatar } from "~/components/user/UserAvatar";
import { ConnectedWalletLabel } from "~/components/web3/ConnnectedWalletLabel";
import { env } from "~/env.mjs";
import { lensAccountToUser } from "~/utils/lens/converters/userConverter";
import { getPublicClient } from "~/utils/lens/getLensClient";

export default function LoginPage() {
  const { isConnected, address: walletAddress } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const { connectors, connect } = useConnect({
    mutation: {
      onError: (error) => {
        toast.error("Connection Failed", { description: error.message });
      },
    },
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!walletAddress) return;

      setLoading(true);
      try {
        const client = getPublicClient();
        const result = await fetchAccountsAvailable(client, {
          managedBy: walletAddress,
          includeOwned: true,
        });

        if (result.isOk()) {
          const accounts = result.value.items.map((item) => item.account);
          setAccounts(accounts);
        } else {
          setError(new Error(result.error.message));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch profiles"));
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && walletAddress) {
      fetchProfiles();
    }
  }, [isConnected, walletAddress]);

  const onSubmit = async (account: Account) => {
    if (!walletAddress || !walletClient) return;

    setIsLoginPending(true);
    setSelectedAccount(account.address);
    try {
      const client = getPublicClient();

      if (!client) {
        throw new Error("No Lens client found");
      }

      const isOwner = account.owner === walletAddress;
      const appAddress =
        env.NEXT_PUBLIC_NODE_ENV === "development" ? env.NEXT_PUBLIC_APP_ADDRESS_TESTNET : env.NEXT_PUBLIC_APP_ADDRESS;
      const ownerRequest = {
        accountOwner: {
          account: account.address,
          owner: walletAddress,
          app: appAddress,
        },
      };
      const managerRequest = {
        accountManager: {
          account: account.address,
          manager: walletAddress,
          app: appAddress,
        },
      };
      const challengeRequest = isOwner ? ownerRequest : managerRequest;

      const signMessage = async (message: string) => {
        const signature = await walletClient.signMessage({
          account: walletAddress as `0x${string}`,
          message,
        });
        return signature;
      };

      const authenticated = await client.login({
        ...challengeRequest,
        signMessage,
      });

      if (authenticated.isErr()) {
        throw new Error(`Failed to get authenticated client: ${authenticated.error.message}`);
      }

      toast.success("Welcome to Ping!");

      const username = account.username?.localName || account.address;

      window.location.href = `/u/${username}`;
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error(err instanceof Error ? err.message : "Failed to log in. Please try again.");
    } finally {
      setIsLoginPending(false);
      setSelectedAccount(null);
    }
  };

  const connectorList = connectors.map((connector) => {
    if (connector.id !== "injected" && connector.id !== "walletConnect" && connector.id !== "familyAccountsProvider")
      return null;

    let name: string;
    let icon: JSX.Element;

    if (connector.id === "injected") {
      name = "Browser Wallet";
      icon = (
        <div className="w-5 h-5">
          <GlobeIcon key={connector.uid} />
        </div>
      );
    } else if (connector.id === "walletConnect") {
      name = "Wallet Connect";
      icon = <WalletConnectIcon key={connector.uid} />;
    } else if (connector.id === "familyAccountsProvider") {
      name = "Continue with Family";
      icon = (
        <div className="w-5 h-5">
          <FamilyIcon key={connector.uid} />
        </div>
      );
    } else {
      return null;
    }

    return (
      <Button
        className="w-full flex flex-row justify-between"
        variant="outline"
        key={connector.uid}
        onClick={() => connect({ connector })}
      >
        {name}
        {icon}
      </Button>
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="wallet-connect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm px-4"
            style={{ width: "100%", maxWidth: "24rem" }}
          >
            <motion.div
              layout
              transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.3 } }}
              className="space-y-6 w-full"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Login to Ping</h1>
                <p className="text-muted-foreground">Select a wallet to connect</p>
              </div>
              <ConnectedWalletLabel />
              <div className="space-y-3">{connectorList}</div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="profile-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
            style={{ width: "100%", maxWidth: "28rem" }}
          >
            <Card variant="glass" className="w-full rounded-2xl overflow-hidden">
              <div className="flex items-center p-4 border-b gap-4">
                <Button variant="ghost" size="icon" onClick={() => disconnect()} className="shrink-0">
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Select Your Profile</h1>
              </div>
              <motion.div
                layout
                transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.3 } }}
                className="w-full"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center p-8"
                    >
                      <LoadingSpinner />
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8"
                    >
                      <Label className="text-center text-red-500">{error.message}</Label>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="profiles"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col"
                    >
                      <ScrollArea className="h-[400px] w-full rounded-md p-4">
                        <div className="flex flex-col gap-2">
                          {accounts.length === 0 ? (
                            <Label className="text-center text-muted-foreground">No Profiles found.</Label>
                          ) : (
                            accounts.map((account, idx) => {
                              const username = account.username?.localName
                                ? `${account.username.localName}`
                                : `#${account.address}`;
                              return (
                                <div id={`${idx}`} key={`${account.address}`}>
                                  <Button
                                    className="flex flex-row items-center justify-start w-full gap-3 hover:scale-100 active:scale-100"
                                    size="default"
                                    variant="outline"
                                    value={account.address}
                                    type="submit"
                                    onClick={() => onSubmit(account)}
                                    disabled={isLoginPending && selectedAccount === account.address}
                                  >
                                    <div className="w-9 h-9">
                                      <UserAvatar link={false} user={lensAccountToUser(account)} />
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span>{username}</span>
                                    </div>
                                    {isLoginPending && selectedAccount === account.address && (
                                      <LoadingSpinner className="ml-auto" />
                                    )}
                                  </Button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </ScrollArea>

                      <div className="p-4 pt-0">
                        <Button
                          className="flex flex-row w-full items-center gap-2"
                          size="default"
                          variant="secondary"
                          onClick={() => {
                            router.push("/register");
                          }}
                        >
                          <PlusIcon size={22} />
                          New Profile
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
