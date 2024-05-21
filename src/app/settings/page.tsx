import { CogIcon, SettingsIcon } from "lucide-react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { SettingsPage } from "~/components/SettingsPage";
import { Card } from "~/components/ui/card";

const settings = async () => {
  return (
    <ServerSignedIn>
      <Card className="z-[30] hover:bg-card p-4 py-0 border-0">
        <h1 className="text-xl font-bold p-4 flex flex-row gap-2 items-center">
          <SettingsIcon fill="hsl(var(--foreground))" fillOpacity={0.6} className="-mb-1" /> settings
        </h1>
        <SettingsPage />
      </Card>
    </ServerSignedIn>
  );
};

export default settings;
