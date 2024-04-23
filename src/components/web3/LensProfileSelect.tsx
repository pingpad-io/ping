"use client";

import { profileId, useLogin, useProfilesManaged, useSession as useLensSession } from "@lens-protocol/react-web";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useAccount as useWagmiAccount } from "wagmi";
import { UserAvatar } from "../UserAvatar";
import { lensProfileToUser } from "../post/Post";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

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
    console.error(error.message);
    return null;
  }

  if (!session || !address) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {profiles.map((profile, idx) => {
          const handleSplit = profile.handle.fullHandle.split("/");
          const handle = handleSplit[0] === "lens" ? `${handleSplit[1]}` : `#${profile.id}`;
          return (
            <div id={`${idx}`} key={`${profile.id}`}>
              <Button
                className="flex flex-row items-center gap-2"
                size="default"
                variant="outline"
                value={profile.id}
                type="submit"
                onClick={() => onSubmit(profile.id)}
              >
                <div className="w-9 h-9">
                  <UserAvatar link={false} user={lensProfileToUser(profile)} />
                </div>
                {handle}
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
      {isLoginPending && <Label>Sign the message in your wallet</Label>}
    </>
  );
}
