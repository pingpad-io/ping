"use client";

import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount, useDisconnect } from "wagmi";
import { SignedIn, SignedOut } from "~/components/Authenticated";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Address } from "~/components/web3/Address";
import { LogoutButton } from "~/components/web3/WalletButtons";

export const SettingsPage = () => {
  const { setTheme } = useTheme();
  const { isConnected: walletConnected, address } = useAccount();
  // const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const themeButtons = ["light", "dark"].map((theme) => (
    <Button
      data-theme={theme}
      type="submit"
      key={theme}
      variant={"secondary"}
      size="sm_icon"
      onClick={() => setTheme(theme)}
    >
      {theme === "dark" ? <MoonIcon size={20} className="sm:mr-2" /> : <SunIcon size={20} className="sm:mr-2" />}
      <div className="hidden sm:flex text-base">{theme}</div>
    </Button>
  ));

  return (
    <div className="p-4 space-y-4">
      <SignedIn>
        {/* <ProfileSettings profile={profile} /> */}

        <Card className="hover:bg-card">
          <CardHeader>
            <CardTitle>App</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-lg">Theme</Label>
            <span className="flex gap-2">{themeButtons}</span>
          </CardContent>
        </Card>

        <Card className="hover:bg-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {walletConnected && (
              <div className="flex flex-row gap-2 items-center">
                Connected wallet: <Address address={address} />
                <Button size="icon" className="w-4 h-4" variant="ghost" onClick={(_e) => disconnect()}>
                  <LogOutIcon />
                </Button>
              </div>
            )}
            <LogoutButton />
          </CardContent>
        </Card>
      </SignedIn>

      <SignedOut>
        <h1 className="m-8 flex flex-row items-center justify-center p-8 text-xl">Sign in to view this page</h1>
      </SignedOut>
    </div>
  );
};
