"use client";

import { Button } from "../ui/button";
import { profileId, useSession as useLensSession, useLogin, useProfilesManaged } from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { truncateEthAddress } from "~/utils/truncateEthAddress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DisconnectWalletButton } from "./WalletButton";
import { LogInIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export function LensProfileSelect() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();
  const { execute: login, loading: isLoginPending } = useLogin();
  const { data: profiles, error, loading } = useProfilesManaged({ for: address, includeOwned: true });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const id = profileId(formData.get("id") as string);

    const result = await login({
      address,
      profileId: id,
    });

    if (result.isSuccess()) {
      console.info(`Welcome ${String(result.value?.handle?.fullHandle ?? result.value?.id)}`);
      return onSuccess();
    }

    console.error(result.error.message);
  };

  const onSuccess = () => {};

  if (!isConnected) return null;

  if (loading) {
    return <>loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (profiles.length === 0) {
    return <p className="mb-4">No Lens Profiles found in this wallet.</p>;
  }

  // connect Lens Profile
  if (!session?.authenticated && address) {
    return (
      <Dialog open>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Select a Lens Profile to login with.</DialogTitle>

            <DialogDescription>
              <p className="mb-4">Connected wallet: {truncateEthAddress(address)}</p>
            </DialogDescription>

            {/* ////////////////////////////////// */}
            <form onSubmit={onSubmit} className="flex">
              <fieldset className="flex place-items-start flex-col w-full">
                <RadioGroup defaultValue="option-one mb-4">
                  {profiles.map((profile, idx) => (
                    <>
                      <div key={profile.id} className="flex items-center space-x-2 p-4">
                        <RadioGroupItem disabled={isLoginPending} value={profile.id} id={`${idx}`} />
                        <Label htmlFor={`${idx}`}>{profile.handle.fullHandle ?? profile.id}</Label>
                      </div>
                      <div key={profile.id} className="flex items-center space-x-2 p-4">
                        <RadioGroupItem disabled={isLoginPending} value={profile.id} id={`${idx}`} />
                        <Label htmlFor={`${idx}`}>{profile.handle.fullHandle ?? profile.id}</Label>
                      </div>
                    </>
                  ))}
                </RadioGroup>

                {/* ////////////////////////////////// */}

                <DialogFooter className="grid grid-cols-2 gap-4 place-content-between items-center space-x-4 w-full">
                  <DisconnectWalletButton />
                  <Button size="sm_icon" disabled={isLoginPending} type="submit">
                    {isLoginPending ? "Sign message in your wallet" : "Login"}
                  </Button>
                </DialogFooter>
              </fieldset>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // // show profile details
  // if (session && session.type === SessionType.WithProfile) {
  //   return (
  //     <>
  //       <p className="mb-4">
  //         You are logged in as{" "}
  //         <span className="font-semibold">{session.profile.handle?.fullHandle ?? session.profile.id}</span>
  //       </p>
  //       <LogoutButton />
  //     </>
  //   );
  // }
}
