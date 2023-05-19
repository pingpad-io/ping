import { useUser } from "@supabase/auth-helpers-react";
import { PropsWithChildren } from "react";

// render any react children only if the user is signed out
export function SignedIn(props: PropsWithChildren) {
  const user = useUser();

  if (!user) {
    return null;
  }

  return <>{props.children}</>;
}

export function SignedOut(props: PropsWithChildren) {
  const user = useUser();

  if (user) {
    return null;
  }

  return <>{props.children}</>;
}
