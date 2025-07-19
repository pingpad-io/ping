import type { PropsWithChildren } from "react";
import { getServerAuth } from "~/utils/getServerAuth";

interface ServerAuthProps extends PropsWithChildren {
  whenSignedOut?: boolean;
}

export async function ServerAuth({ children, whenSignedOut = false }: ServerAuthProps) {
  const { isAuthenticated } = await getServerAuth();

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
