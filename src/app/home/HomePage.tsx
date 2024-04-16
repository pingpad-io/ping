"use client";

import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { PersonalFeed, PublicFeed } from "~/components/Feed";
import { LensProfileSelect } from "~/components/web3/LensProfileSelect";

export const HomePage = () => {
  const { data: session } = useLensSession();

  if (!session || !(session.type === SessionType.WithProfile)) {
    return (
      <>
        <PublicFeed />
        <LensProfileSelect />
      </>
    );
  }

  return <PersonalFeed />;
};
