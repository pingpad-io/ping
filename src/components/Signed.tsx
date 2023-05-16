import { useSession } from "@supabase/auth-helpers-react";

// render any react children only if the user is signed out
export function SignedIn({ children }: { children: JSX.Element }) {
  const session = useSession();

  if (!session) {
    return null;
  }

  return <div className="h-max w-max">{children}</div>;
}

export function SignedOut({ children }: { children: JSX.Element }) {
  const session = useSession();

  if (session) {
    return null;
  }

  return <div className="h-max w-max">{children}</div>;
}
