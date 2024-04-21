"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionType,
  profileId,
  useLogin,
  useProfilesManaged,
  useSession as useLensSession,
} from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Address } from "./Address";
import { DisconnectWalletButton } from "./WalletButton";
import { Label } from "../ui/label";
import { UserAvatar } from "../UserAvatar";
import { lensProfileToUser } from "../post/Post";

export function LensProfileSelect() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();
  const { execute: login, loading: isLoginPending } = useLogin();
  const { data: profiles, error, loading } = useProfilesManaged({ for: address, includeOwned: true });


  const onSubmit = async (profile: string) => {
    const id = profileId(profile);

    const result = await login({
      address,
      profileId: id,
    });

    if (result.isSuccess()) {
      console.info(`Welcome ${String(result.value?.handle?.fullHandle ?? result.value?.id)}`);
    } else {
      console.error(result.error.message);
    }
  };

  if (!isConnected) return null;

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error.message)
    return null;
  }

  if (profiles.length === 0) {
    return <p className="mb-4">No Lens Profiles found in this wallet.</p>;
  }

  if (!session || !address) {
    return null
  }

  return (
    <Dialog open>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select a Lens Profile</DialogTitle>

          <DialogDescription>
            <p className="mb-4">
              Connected wallet: <Address address={address} />
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {profiles.map((profile, idx) => {
            const handleSplit = profile.handle.fullHandle.split("/");
            const handle = handleSplit[0] === "lens" ? `${handleSplit[1]}` : `#${profile.id}`;
            return (
              <div id={`${idx}`} key={`${profile.id}`}>
                <Button className="flex flex-row items-center gap-2" size="default" variant="outline" value={profile.id} type="submit" onClick={() => onSubmit(profile.id)}>
                  <div className="w-9 h-9">
                    <UserAvatar link={false} user={lensProfileToUser(profile)} />
                  </div>
                  {handle}
                </Button>
              </div>
            );
          })}

        </div>

        {isLoginPending ? <Label>Sign the message in your wallet to login</Label> : <></>}
      </DialogContent>
    </Dialog>
  );
}
