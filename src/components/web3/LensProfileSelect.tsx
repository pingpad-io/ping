"use client";

import type { Account } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { setCookie } from "cookies-next";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount as useWagmiAccount, useWalletClient } from "wagmi";
import Link from "~/components/Link";
import { env } from "~/env.mjs";
import { getPublicClient } from "~/utils/lens/getLensClient";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { lensAcountToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";

export function LensProfileSelect({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const { isConnected, address: walletAddress } = useWagmiAccount();
  const { data: walletClient } = useWalletClient();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(false);

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

      const credentials = await authenticated.value.getCredentials();

      if (credentials.isErr()) {
        console.error("Failed to get credentials", credentials.error);
        throw new Error("Unable to retrieve authentication credentials");
      }

      const refreshToken = credentials.value?.refreshToken;

      if (!refreshToken) {
        console.error("Failed to get refresh token - missing from credentials");
        throw new Error("Authentication token unavailable");
      }

      setCookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "lax",
      });

      setDialogOpen(false);
      window.location.reload();

      toast.success("Welcome to Ping!", { description: "login successful!" });
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error(err instanceof Error ? err.message : "Failed to log in. Please try again.");
    } finally {
      setIsLoginPending(false);
    }
  };

  if (!isConnected) return null;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error(error.message);
    return null;
  }

  if (!walletAddress) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {accounts.map((account, idx) => {
          const username = account.username?.localName ? `@${account.username.localName}` : `#${account.address}`;
          const isOwner = account.owner === walletAddress;
          return (
            <div id={`${idx}`} key={`${account.address}`}>
              <Button
                className="flex flex-row items-center gap-2"
                size="default"
                variant="outline"
                value={account.address}
                type="submit"
                onClick={() => onSubmit(account)}
              >
                <div className="w-9 h-9">
                  <UserAvatar link={false} user={lensAcountToUser(account)} />
                </div>
                <div className="flex flex-col items-start">
                  <span>{username}</span>
                  <span className="text-xs text-muted-foreground">{isOwner ? "Owner" : "Manager"}</span>
                </div>
              </Button>
            </div>
          );
        })}
        <Link href={"https://lens.xyz/mint"} target="_blank">
          <Button className="flex flex-row h-full w-full items-center gap-2" size="default" variant="outline">
            <PlusIcon size={22} />
            New Profile
          </Button>
        </Link>
      </div>

      {accounts.length === 0 && <Label className="mb-4">No Profiles found.</Label>}
      {isLoginPending && <Label>Sign a message in your wallet</Label>}
    </>
  );
}
