"use client";

import { LimitType, SessionType, useFeed, useSession as useLensSession } from "@lens-protocol/react-web";
import { Feed } from "~/components/Feed";
import { LensProfileSelect } from "~/components/web3/LensProfileSelect";

export const HomePage = () => {
  const { data: session } = useLensSession();

  if (!session || !(session.type === SessionType.WithProfile)) {
    return (
      <div>
        <LensProfileSelect />
      </div>
    );
  }

  return (
      <Feed profileId={session.profile.id} />
  );
};
