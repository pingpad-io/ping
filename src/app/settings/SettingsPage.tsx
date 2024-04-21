"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut } from "~/components/Authenticated";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { LogoutButton } from "~/components/web3/WalletButton";

export const SettingsPage = () => {
  const { setTheme } = useTheme();

  const themeButtons = ["light", "dark"].map((theme) => (
    <Button
      data-theme={theme}
      type="submit"
      key={theme}
      variant={"secondary"}
      size="sm_icon"
      onClick={() => setTheme(theme)}
    >
      {theme === "dark" ? <MoonIcon className="sm:mr-2" /> : <SunIcon className="sm:mr-2" />}
      <div className="hidden sm:flex text-xl">{theme}</div>
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
            <Label>Theme</Label>
            <span className="flex gap-2">{themeButtons}</span>
          </CardContent>
        </Card>

        <Card className="hover:bg-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
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
