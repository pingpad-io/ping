import type { PropsWithChildren } from "react";
import { validateSession } from "~/utils/validateSession";

interface ServerAuthProps extends PropsWithChildren {
  whenSignedOut?: boolean;
}

export async function ServerAuth({ children, whenSignedOut = false }: ServerAuthProps) {
  const { isAuthenticated } = await validateSession();

  const shouldRender = whenSignedOut ? !isAuthenticated : isAuthenticated;

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}

export async function ServerSignedIn(props: PropsWithChildren) {
  return <ServerAuth {...props} />;
}

export async function ServerSignedOut(props: PropsWithChildren) {
  return <ServerAuth {...props} whenSignedOut />;
}
