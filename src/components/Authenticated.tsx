import { useSession } from "@lens-protocol/react-web";
import type { PropsWithChildren } from "react";

// render any react children only if the user is signed out
export function SignedIn(props: PropsWithChildren) {
  const { data: session} = useSession();

  if (!session || !session.authenticated) {
    return null;
  }

  return <>{props.children}</>;
}

export function SignedOut(props: PropsWithChildren) {
  const { data: session} = useSession();

  if (session?.authenticated) {
    return null;
  }

  return <>{props.children}</>;
}
