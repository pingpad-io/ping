import { SettingsIcon } from "lucide-react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { SettingsPage } from "~/components/SettingsPage";
import { Card } from "~/components/ui/card";

const settings = async () => {
  return (
    <ServerSignedIn>
      <SettingsPage />
    </ServerSignedIn>
  );
};

export default settings;
