"use client";

import { Button } from "../ui/button";
import {
  profileId,
  useSession as useLensSession,
  useLogin,
  useProfilesManaged,
} from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { truncateEthAddress } from "~/utils/truncateEthAddress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DisconnectWalletButton } from "./WalletButton";

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
      <Dialog>
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Lens Profile to login with.</DialogTitle>

              <DialogDescription>
                <p className="mb-4">Connected wallet: {truncateEthAddress(address)}</p>

                {/* ////////////////////////////////// */}
                <form onSubmit={onSubmit} className="flex">
                  <fieldset className="flex place-items-center flex-col">
                    <div className="my-4 space-y-2">
                      {profiles.map((profile, idx) => (
                        <>
                          <label
                            key={profile.id}
                            className="w-full items-center p-4 rounded-lg cursor-pointer border transition-colors border-gray-300 hover:border-gray-500 grid grid-cols-[24px_auto]"
                          >
                            <input
                              disabled={isLoginPending}
                              type="radio"
                              defaultChecked={idx === 0}
                              name="id"
                              value={profile.id}
                              className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-green-500 checked:ring-green-500"
                            />
                            <span className="font-semibold">{profile.handle?.fullHandle ?? profile.id}</span>
                          </label>
                          <label
                            key={profile.id}
                            className="w-full items-center p-4 rounded-lg cursor-pointer border transition-colors border-gray-300 hover:border-gray-500 grid grid-cols-[24px_auto]"
                          >
                            <input
                              disabled={isLoginPending}
                              type="radio"
                              defaultChecked={idx === 0}
                              name="id"
                              value={profile.id}
                              className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-green-500 checked:ring-green-500"
                            />
                            <span className="font-semibold">{profile.handle?.fullHandle ?? profile.id}</span>
                          </label>
                        </>
                      ))}
                    </div>

                    <div>
                      <Button disabled={isLoginPending} type="submit">
                        {isLoginPending ? "Sign message in your wallet" : "Login to Lens"}
                      </Button>
                    </div>
                  </fieldset>
                </form>
                {/* ////////////////////////////////// */}

                <div className="mt-2">
                  <DisconnectWalletButton />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
