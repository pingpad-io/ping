import { ServerSignedIn } from "~/components/ServerSignedIn";
import { SettingsPage } from "~/components/SettingsPage";

const settings = async () => {
  return (
    <ServerSignedIn>
      <SettingsPage />
    </ServerSignedIn>
  );
};

export default settings;
