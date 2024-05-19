import { Suspense } from "react";
import { ServerSignedIn } from "~/components/ServerSignedIn";
import { SettingsPage } from "./SettingsPage";

const settings = async () => {
  return (
    <Suspense>
      <ServerSignedIn>
        <SettingsPage />
      </ServerSignedIn>
    </Suspense>
  );
};

export default settings;
