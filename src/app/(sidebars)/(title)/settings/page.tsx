import { Badge, NetworkIcon, PawPrintIcon, SettingsIcon, WalletIcon } from "lucide-react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { PingButton, SettingsPage } from "~/components/SettingsPage";
import { ThemeButtons } from "~/components/ThemeToggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
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
            <Accordion className="w-full" type="multiple">
              <AccordionItem value="interests">
                <AccordionTrigger className="py-2">
                  <h1 className="text-lg flex gap-2 items-center">
                    <PawPrintIcon /> Interests
                  </h1>
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <UserInterestList interests={user.interests} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wallet">
                <AccordionTrigger className="py-2">
                  <h1 className="text-lg flex gap-2 items-center">
                    <WalletIcon /> Wallet
                  </h1>
                </AccordionTrigger>
                <AccordionContent className="pl-4 flex flex-col gap-2">
                  <ConnectedWalletLabel />
                  <LogoutButton />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </ServerSignedIn>
  );
};

export default settings;
