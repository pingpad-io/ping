"use client";

import { setCookie } from "cookies-next";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useAccount as useWagmiAccount, useWalletClient } from "wagmi";
import Link from "~/components/Link";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { lensAcountToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { getPublicClient } from "~/utils/lens/getLensClient";
import { useState, useEffect } from "react";
import { getAccountOwnerClient } from "~/utils/lens/getLensClient";
import type { Account, AuthenticatedUser } from "@lens-protocol/client";

export function LensProfileSelect({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const { isConnected, address } = useWagmiAccount();
  const { data: walletClient } = useWalletClient();
  const [profiles, setProfiles] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(false);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const client = getPublicClient();
        const result = await fetchAccountsAvailable(client, { 
          managedBy: address, 
          includeOwned: true 
        });
        
        if (result.isOk()) {
          // Extract accounts from the paginated result
          const accounts = result.value.items.map(item => item.account);
          setProfiles(accounts);
        } else {
          setError(new Error(result.error.message));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profiles'));
      } finally {
        setLoading(false);
      }
    };
    
    if (isConnected && address) {
      fetchProfiles();
    }
  }, [isConnected, address]);

  const onSubmit = async (accountAddress: string) => {
    if (!address || !walletClient) return;
    
    setIsLoginPending(true);
    try {
      const signMessage = async (message: string) => {
        const signature = await walletClient.signMessage({ 
          account: address as `0x${string}`,
          message 
        });
        return signature;
      };
      
      const client = await getAccountOwnerClient(
        address, // owner address
        accountAddress, // account address
        signMessage
      );
      
      if (!client) {
        throw new Error("Failed to authenticate");
      }
      
      const credentials = await client.getCredentials();
      if (credentials.isErr()) {
        throw new Error(credentials.error.message);
      }
      
      // Get the username from the authenticated account
      const authenticatedUser = await client.getAuthenticatedUser();
      if (authenticatedUser.isErr() || !authenticatedUser.value) {
        throw new Error("Failed to get authenticated user");
      }
      
      // Get account details from authenticated user
      const accountDetails = authenticatedUser.value as unknown as { address: string };
      const username = accountDetails.address;
      
      // Store the refresh token in cookies
      if (credentials.value.refreshToken) {
        setCookie("refreshToken", credentials.value.refreshToken, {
          secure: true,
          sameSite: "lax",
        });
      }
      
      setDialogOpen(false);
      window.location.reload();

      toast.success(`Welcome @${username}`, { description: "login successful!" });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Login failed');
      toast.error("Login failed", { 
        description: err instanceof Error ? err.message : 'Unknown error' 
      });
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

  if (!address) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {profiles.map((profile, idx) => {
          const username = profile.username?.localName ? `@${profile.username.localName}` : `#${profile.address}`;
          return (
            <div id={`${idx}`} key={`${profile.address}`}>
              <Button
                className="flex flex-row items-center gap-2"
                size="default"
                variant="outline"
                value={profile.address}
                type="submit"
                onClick={() => onSubmit(profile.address)}
              >
                <div className="w-9 h-9">
                  <UserAvatar link={false} user={lensAcountToUser(profile)} />
                </div>
                {username}
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

      {profiles.length === 0 && <Label className="mb-4">No Profiles found.</Label>}
      {isLoginPending && <Label>Sign a message in your wallet</Label>}
    </>
  );
}
