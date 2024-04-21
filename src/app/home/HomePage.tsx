"use client";

import { SessionType, useSession as useLensSession } from "@lens-protocol/react-web";
import { PersonalFeed, PublicFeed } from "~/components/Feed";

export const HomePage = () => {
  const { data: session } = useLensSession();

  if (!session || !(session.type === SessionType.WithProfile)) {
    return <PublicFeed />;
  }

  return <PersonalFeed />;
};
