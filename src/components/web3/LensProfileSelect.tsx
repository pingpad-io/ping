"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionType,
  profileId,
  useLogin,
  useProfilesManaged,
  useSession as useLensSession,
} from "@lens-protocol/react-web";
import { useForm } from "react-hook-form";
import { useAccount as useWagmiAccount } from "wagmi";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Address } from "./Address";
import { DisconnectWalletButton } from "./WalletButton";

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
    return null;
  }

  if (error) {
    console.error(error.message)
    return null;
  }

  if (profiles.length === 0) {
    return <p className="mb-4">No Lens Profiles found in this wallet.</p>;
  }

  if (session && !(session.type === SessionType.WithProfile) && address) {
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex place-items-start flex-col mb-8 w-full">
                    <FormLabel>Pick Username</FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        disabled={isLoginPending}
                        className="flex flex-col gap-4"
                        defaultValue="default"
                      >
                        {profiles.map((profile, idx) => {
                          const handleSplit = profile.handle.fullHandle.split("/");
                          const handle = handleSplit[0] === "lens" ? `@${handleSplit[1]}` : `#${profile.id}`;
                          return (
                            <FormItem className="flex items-center space-x-2 space-y-0" id={`${idx}`}>
                              <FormControl>
                                <RadioGroupItem defaultChecked={idx === 0} value={profile.id} />
                              </FormControl>
                              <FormLabel className="font-normal">{handle}</FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row items-center justify-between w-full">
                <DisconnectWalletButton>Cancel</DisconnectWalletButton>
                <Button size="sm_icon" disabled={isLoginPending} type="submit">
                  {isLoginPending ? "Sign a message" : "Login"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
}
