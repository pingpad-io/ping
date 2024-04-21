"use client";

import { useTheme } from "next-themes";
import { SignedIn, SignedOut } from "~/components/Authenticated";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DisconnectWalletButton } from "~/components/web3/WalletButton";

export const SettingsPage = () => {
  const { setTheme } = useTheme();

  const themeButtons = ["light", "dark"].map((theme) => (
    <Button
      data-theme={theme}
      type="submit"
      key={theme}
      variant={theme === "dark" ? "secondary" : "outline"}
      onClick={() => setTheme(theme)}
    >
      {theme}
    </Button>
  ));

  return (
    <div className="p-4 space-y-4">
      <SignedIn>
        {/* <ProfileSettings profile={profile} /> */}

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="flex gap-2">{themeButtons}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <DisconnectWalletButton>
              Disconnect
            </DisconnectWalletButton>
          </CardContent>
        </Card>
      </SignedIn>

      <SignedOut>
        <h1 className="m-8 flex flex-row items-center justify-center p-8 text-xl">Sign in to view this page</h1>
      </SignedOut>
    </div>
  );
};
