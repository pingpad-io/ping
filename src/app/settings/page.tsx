import { Suspense } from "react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { SettingsPage } from "~/components/SettingsPage";

const settings = async () => {
  return (
    <ServerSignedIn>
      <Suspense>
        <SettingsPage />
      </Suspense>
    </ServerSignedIn>
  );
};

export default settings;
