"use client";

import { useSession } from "@lens-protocol/react-web";
import type { PropsWithChildren } from "react";

export function SignedIn(props: PropsWithChildren) {
  const { data: session } = useSession();

  if (!session || !session.authenticated) {
    return null;
  }

  return <>{props.children}</>;
}

export function SignedOut(props: PropsWithChildren) {
  const { data: session } = useSession();

  if (session?.authenticated) {
    return null;
  }

  return <>{props.children}</>;
}
