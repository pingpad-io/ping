import { NetworkIcon, SettingsIcon } from "lucide-react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { PingButton, SettingsPage } from "~/components/SettingsPage";
import { ThemeButtons } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { UserInterestList } from "~/components/user/UserInterests";
import { ConnectedWalletLabel } from "~/components/web3/ConnnectedWalletLabel";
import { LogoutButton } from "~/components/web3/WalletButtons";
import { getLensClient } from "~/utils/getLensClient";

const settings = async () => {
  const { user } = await getLensClient();

  return (
    <ServerSignedIn>
      <div className="space-y-4">
        <Card className="hover:bg-card">
          <CardHeader>
            <CardTitle>App</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Label className="text-lg">Theme</Label>
            <span className="flex gap-2">
              <ThemeButtons />
            </span>
            <Label className="text-lg">Misc</Label>
            <PingButton />
          </CardContent>
        </Card>

        <Card className="hover:bg-card">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <UserInterestList interests={user.interests} />
            <ConnectedWalletLabel />
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </ServerSignedIn>
  );
};

export default settings;
