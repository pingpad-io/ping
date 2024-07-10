"use client";

import { profileId, useSession as useLensSession, useLogin, useProfilesManaged } from "@lens-protocol/react-web";
import { setCookie } from "cookies-next";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount as useWagmiAccount } from "wagmi";
import { LoadingSpinner } from "../LoadingIcon";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { lensProfileToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";

export function LensProfileSelect({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
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
      const handle = result.value?.handle?.localName ?? result.value?.id;
      const refreshToken = JSON.parse(localStorage.getItem("lens.production.credentials"))?.data?.refreshToken;
      if (refreshToken) {
        setCookie("refreshToken", refreshToken, {
          secure: true,
          sameSite: "lax",
        });
      }
      setDialogOpen(false);
      window.location.reload();

      toast.success(`Welcome @${handle}`, { description: "login successful!" });
    } else {
      console.error(result.error.message);
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

  if (!session || !address) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {profiles.map((profile, idx) => {
          const handle = profile.handle.namespace === "lens" ? `@${profile.handle.localName}` : `#${profile.id}`;
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
      {isLoginPending && <Label>Sign a message in your wallet</Label>}
    </>
  );
}
