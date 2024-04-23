import { Suspense } from "react";
import { SettingsPage } from "./SettingsPage";

const settings = async () => {
  return (
    <Suspense>
      <SettingsPage />
    </Suspense>
  );
};

export default settings;
