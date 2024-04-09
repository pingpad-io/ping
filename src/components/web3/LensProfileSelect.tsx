"use client";

import { Button } from "../ui/button";
import {
  profileId,
  SessionType,
  useSession as useLensSession,
  useLogin,
  useProfilesManaged,
} from "@lens-protocol/react-web";
import { useAccount as useWagmiAccount } from "wagmi";
import { truncateEthAddress } from "~/utils/truncateEthAddress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DisconnectWalletButton } from "./WalletButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { LogoutButton } from "./LogoutButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export function LensProfileSelect() {
  const { isConnected, address } = useWagmiAccount();
  const { data: session } = useLensSession();
  const { execute: login, loading: isLoginPending } = useLogin();
  const { data: profiles, error, loading } = useProfilesManaged({ for: address, includeOwned: true });

  const formSchema = z.object({
    id: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    event.preventDefault();

    const id = profileId(values.id);

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
    return <>loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (profiles.length === 0) {
    return <p className="mb-4">No Lens Profiles found in this wallet.</p>;
  }

  // connect Lens Profile
  if (session &&!(session.type === SessionType.WithProfile) && address) {
    return (
      <Dialog open>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Select a Lens Profile to login with.</DialogTitle>

            <DialogDescription>
              <p className="mb-4">Connected wallet: {truncateEthAddress(address)}</p>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex place-items-start flex-col w-full">
                    <FormLabel>Pick Username</FormLabel>
                    <FormControl>
                      <RadioGroup {...field} disabled={isLoginPending} defaultValue="option-one" className="mb-4">
                        {profiles.map((profile, idx) => (
                          <FormItem className="flex items-center space-x-3 space-y-0" id={`${idx}`}>
                            <FormControl>
                              <RadioGroupItem value={profile.id} />
                            </FormControl>
                            <FormLabel className="font-normal">{profile.handle.fullHandle ?? profile.id}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="grid grid-cols-2 gap-4 place-content-between items-center space-x-4 w-full">
                <DisconnectWalletButton />
                <Button size="sm_icon" disabled={isLoginPending} type="submit">
                  {isLoginPending ? "Sign a message" : "Login"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
}
